const config = require("../../config/keys");
const db = require("../db/dataLayer");
const m = require("moment");

var stravaAPI = require("strava-v3");
stravaAPI.config({
  client_id: config.client_id,
  client_secret: config.client_secret,
  redirect_uri: config.redirect_uri,
});
let APP_STRAVA = null;

const stravaQueue = {
  processQueue,
};

async function processQueue() {
  console.log("Process Queue");

  await getStravaClient();
  let stravaRatePercent = await stravaRate();
  //if less than 75% proceed
  while (stravaRatePercent < 75) {
    let processed = 0;
    try {
      processed += await getActivityDetails();

      processed += await processPathlessSegments();
    } catch (error) {
      console.log("Queue Error:", error.message);
      console.log(error.errors);
      break;
    }
    stravaRatePercent = stravaRate();
    console.log(`Strava Rate currently at: ${stravaRatePercent}%`);
    if (processed === 0) break;
  } //while

  console.log("Process Done");
}

async function getActivityDetails() {
  console.log("Get Activity Details");
  const memo = {};
  const completedActivities = [];

  const activities = await db.popActivities();

  console.log(`Geting details for ${activities.length} activities`);
  if (activities.length === 0) return 0;

  for (const activity of activities) {
    const athleteId = activity.athleteId;

    const strava = await getClient(athleteId, memo);

    const fullActivity = await strava.activities.get({
      id: activity.id,
      include_all_efforts: true,
    });

    const result = await parseActivity(fullActivity);
    if (result) completedActivities.push(activity.id);
  }

  await db.deleteActivities(completedActivities);

  return activities.length;
}

async function parseActivity(activity) {
  const rankedSegments = parseRankedSegments(activity);
  try {
    await db.storeSegments(rankedSegments);
  } catch (error) {
    console.log("Store Segment Error", error.message);
    return false;
  }
  return true;
}

async function getClient(athleteId, memo) {
  if (memo[athleteId]) return memo[athleteId];

  const user = await db.getUser(athleteId);

  const refreshResult = await stravaAPI.oauth.refreshToken(user.refreshToken);
  if (refreshResult.access_token !== user.accessToken) {
    user.accessToken = refreshResult.access_token;
    db.updateUser(user);
  }

  const strava = new stravaAPI.client(user.accessToken);

  memo[athleteId] = strava;
  return strava;
}

const parseRankedSegments = (activity) => {
  const rankedSegments = [];
  if (!activity.segment_efforts) {
    console.log("No Segment efforts on Activity");
    return [];
  }

  activity.segment_efforts.forEach((effort) => {
    if (effort.kom_rank <= 10 && effort.kom_rank > 0) {
      // console.log(`Saving Effort:${effort.name} with Rank:${effort.kom_rank}`);
      rankedSegments.push(effort);
    }
  });

  return rankedSegments;
};

function stravaRate() {
  if (stravaAPI.rateLimiting.shortTermUsage + stravaAPI.rateLimiting.longTermUsage === 0) return 0;
  const stravaRate = stravaAPI.rateLimiting.fractionReached();

  const percent = (stravaRate * 100).toFixed(2);
  return percent;
}

async function processPathlessSegments() {
  console.log("processPathlessSegments");

  const segments = await db.popDetails();
  const ids = segments.map((segment) => segment.id);

  if (ids.length === 0) return 0;

  for (const id of ids) {
    let data = await getSegmentDetails(id);
    if (!data) {
      console.log("Error Fetching Data for Segment Id:", id);
      data = { id, line: "error" };
    } else {
      data.updated = m().format();
    }
    await db.addDetails(data);
  }
  return ids.length;
}

async function getSegmentDetails(id) {
  if (APP_STRAVA === null) await getStravaClient();
  try {
    const result = await APP_STRAVA.segments.get({ id });
    return {
      id: result.id,
      line: result.map.polyline,
      effortCount: result.effort_count,
      athleteCount: result.athlete_count,
      distance: result.distance,
      elevation: result.total_elevation_gain,
    };
  } catch (error) {
    console.log(`Error on id:${id}::`, error.message);
  }
}

async function getStravaClient() {
  const refreshToken = config.client_refresh;
  const result = await stravaAPI.oauth.refreshToken(refreshToken);
  const expires = m.unix(result.expires_at);

  console.log("App Token Expires at:", expires.format("hh:mm A"));
  console.log(expires.fromNow());

  APP_STRAVA = new stravaAPI.client(result.access_token);
}

module.exports = stravaQueue;
