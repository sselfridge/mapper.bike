# CLAUDE.md — mapper.bike

## Project Overview

mapper.bike is a full-stack web app that lets users visualize Strava cycling activities on an interactive Google Map. It authenticates via Strava OAuth, fetches activity/segment data, and displays it with filtering by date range and activity type. It also includes a KOM (King of the Mountain) segment tracker with leaderboard management.

## Tech Stack

- **Frontend:** React 17, Material-UI v4 (`makeStyles`), Google Maps (custom `google-maps-react` fork), Axios
- **Backend:** Node.js + Express 4, JWT auth (cookies), Cryptr for token encryption
- **Database:** AWS DynamoDB (`us-west-2`, profile `dbuser`)
- **Strava SDK:** `strava-v3`
- **Dev tooling:** Create React App (react-scripts 5), Nodemon, ESLint, Prettier

## Commands

```bash
# Frontend dev (port 8080)
npm run dev          # Unix
npm run winStart     # Windows

# Backend dev (port 3000)
npm run server       # Unix
npm run winServer    # Windows

# Production build
npm run build
npm run buildTest    # sets REACT_APP_ENVIRONMENT=test

# Lint
npm run lint

# Tests (Jest via CRA)
npm run test-rs

# Production (PM2)
pm2 start ecosystem.config.js --env production
```

## Project Structure

```
src/                    # React frontend
  api/                  # Axios API client (strava.js, google.js)
  components/           # UI components
    header/
    sidebar/
      activities/       # Activities tab
      efforts/          # Segment efforts tab
      shared/           # Shared UI pieces
    styledMui/          # Customized MUI components
  containers/           # Top-level components (App.js, Board.js, ThemedApp.js)
  config/               # keys.js (git-ignored), zip_lat_lang.js, demoData.json
  constants/            # map.js, sidebar.js, DemoActivities.js
  utils/                # Helper functions

server/                 # Express backend
  controllers/          # Route handlers (OAuth, activities, segments, users)
  models/               # Data models + DynamoDB layer (models/db/)
  services/             # Business logic, queues (ActivityQueue, SegmentQueue)
  utils/                # stravaClient.js, dayjs timezone config
  server.js             # Express app + route definitions
  start.js              # Entry point
```

## Configuration

Frontend config lives in `src/config/keys.js` (git-ignored). Copy `keys-EXAMPLE.js` to set up:

```js
{
  client_id: "STRAVA_CLIENT_ID",
  client_secret: "STRAVA_CLIENT_SECRET",
  client_refresh: "STRAVA_REFRESH_TOKEN",
  callback_uri: "http://localhost:8080/api/strava/callback",
  redirect_url: "http://localhost:8080",
  secretSuperKey: "JWT_ENCRYPTION_SECRET",
  mapsApi: "GOOGLE_MAPS_API_KEY",
  dbTables: {
    activities: "activities",
    segmentDetails: "segmentDetails",
    segmentEfforts: "segmentEfforts",
    users: "users"
  }
}
```

AWS credentials: `~/.aws/credentials` with a `[dbuser]` profile targeting `us-west-2`.

## Key Architectural Patterns

- **MVC on the server:** Controllers → Services → Models/DB
- **DB abstraction:** All DynamoDB calls go through `server/models/db/` — never call AWS SDK directly from controllers
- **Queue pattern:** `ActivityQueue` and `SegmentQueue` in `server/services/classes/` handle async batch processing; a cron job fires every 15 minutes to drain the queue
- **JWT session:** Encrypted JWT stored as a secure cookie; token refresh is handled automatically in the OAuth controller
- **React state:** Local `useState`/`useEffect` hooks throughout; no global state library — props drilling is intentional for this project size
- **Map ↔ list sync:** Selecting an activity on the map scrolls the sidebar list and vice versa via shared callback props (`handleSelected`)

## DynamoDB Tables

| Table            | Partition Key        | Notes                                          |
| ---------------- | -------------------- | ---------------------------------------------- |
| `activities`     | `id`                 | Queue of activities pending segment processing |
| `segmentDetails` | `id`                 | Cached segment polylines; `hasLine-index` GSI  |
| `segmentEfforts` | `segmentId` + `rank` | Top-10 efforts; `athleteId-rank-index` GSI     |
| `users`          | `athleteId`          | OAuth tokens (encrypted) and user metadata     |

DynamoDB batch writes are capped at 25 items; the queue classes handle chunking automatically.

## API Routes

| Method | Path                                  | Purpose                            |
| ------ | ------------------------------------- | ---------------------------------- |
| GET    | `/api/getStravaUser`                  | Current user profile               |
| GET    | `/api/summaryActivities`              | Activities (filtered by date/type) |
| GET    | `/api/segmentEfforts?rank=10`         | Top-N efforts                      |
| GET    | `/api/strava/callback`                | OAuth callback                     |
| GET    | `/api/refreshLeaderboard?segmentId=X` | Refresh segment leaderboard        |
| POST   | `/api/initialize`                     | Bootstrap new user                 |
| POST   | `/api/logout`                         | Clear session                      |
| DELETE | `/api/users/:id`                      | Delete all user data               |

## Code Conventions

- **Components:** functional with hooks only — no class components
- **Styling:** `makeStyles` from MUI v4; no plain CSS except `src/styles.css` for global resets
- **Naming:** components PascalCase, utilities camelCase, DB modules prefixed `_*Db`, constants UPPER_SNAKE_CASE
- **Async:** mix of `.then()/.catch()` (older code) and `async/await` (newer code) — prefer `async/await` in new code
- **Linting:** ESLint with `react-app` preset; run `npm run lint` before committing

## MUI Theme

Defined in `src/containers/ThemedApp.js`:

- Primary: Light Blue
- Secondary: Green
- Strava brand colour: `#FC4C02`

## Production Deployment

Managed via PM2 (`ecosystem.config.js`). Production serves on port 8080 (HTTP) and 8443 (HTTPS). SSL certs expected at `privkey.pem` / `fullchain.pem`; renewed via `certRenew.sh`.
