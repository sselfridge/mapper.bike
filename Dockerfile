# ---- Build stage: compile React frontend ----
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# REACT_APP_MAPS_API is baked into the JS bundle at build time
ARG REACT_APP_MAPS_API=oopsies
ARG REACT_APP_STRAVA_CLIENT_ID=36974
ARG REACT_APP_STRAVA_CLIENT_ASDF_ID

RUN echo "The value is: $REACT_APP_STRAVA_CLIENT_ASDF_ID"

ENV REACT_APP_MAPS_API=${REACT_APP_MAPS_API}
ENV REACT_APP_STRAVA_CLIENT_ID=${REACT_APP_STRAVA_CLIENT_ID}
ENV REACT_APP_STRAVA_CLIENT_ASDF_ID=${REACT_APP_STRAVA_CLIENT_ASDF_ID}

RUN npm run build

# ---- Production stage ----
FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# Copy server source
COPY server/ ./server/

# keys.js is needed by both the server and was already bundled into the React build
COPY src/config/ ./src/config/

# Static assets served by Express
COPY public/ ./public/

# React build output from builder stage
COPY --from=builder /app/build ./build

EXPOSE 8080
ENV NODE_ENV=production

CMD ["node", "server/start.js"]
