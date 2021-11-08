const config = require("../../src/config/keys");
const db = require("../models/db/dataLayer");
// const m = require("moment");
const dayjs = require("../utils/dayjs");
var stravaAPI = require("strava-v3");
const SegmentQueue = require("./classes/SegmentQueue");
const ActivityQueue = require("./classes/ActivityQueue");

stravaAPI.config({
  client_id: config.client_id,
  client_secret: config.client_secret,
  redirect_uri: config.redirect_uri,
});
let _APP_STRAVA = null;

const stravaQueue = {
  processQueue,
  updateUserRefreshToken,
  deleteAllActivities,
};

async function processQueue() {
  console.log("Process Queue");

  await getStravaClient();
  let stravaRatePercent = await stravaRate();

  const segmentQ = new SegmentQueue();
  await segmentQ.init();

  const activityQ = await new ActivityQueue().init();

  while (stravaRatePercent < 75) {
    let processed = 0;
    try {
      processed += await activityQ.process();
      processed += await segmentQ.process();
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
  const completedActivityIds = [];

  const activities = await db.popActivities();

  console.log(`Getting details for ${activities.length} activities`);
  if (activities.length === 0) return 0;
  for (const activity of activities) {
    try {
      const athleteId = activity.athleteId;

      const strava = await getClient(athleteId, memo);

      const fullActivity = await strava.activities.get({
        id: activity.id,
        include_all_efforts: true,
      });

      const result = await parseActivity(fullActivity);
      if (result) completedActivityIds.push(activity.id);
    } catch (error) {
      console.log("Activity Detail Fetch Error:", activity.id, error.message);
      // TODO - add error field to activities so they can be skipped later
      // or maybe just log and delete them?
    }
  }
  if (completedActivityIds.length > 0)
    await db.deleteActivities(completedActivityIds);

  return completedActivityIds.length;
}

async function parseActivity(activity) {
  if (!activity.map.summary_polyline) {
    console.log(`No poly line on activity ${activity.id} - skipping`);
    return true;
  }
  const rankedSegments = getRankedEfforts(activity);
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

  if (!user) throw new Error("User not defined in DB:", athleteId);

  //TODO - Add validation so accessToken matches up with user ID.
  //got this crossed for nigel in debugging and now I can't access any of his data
  const refreshResult = await stravaAPI.oauth.refreshToken(user.refreshToken);
  if (refreshResult.access_token !== user.accessToken) {
    user.accessToken = refreshResult.access_token;
    db.updateUser(user);
  }

  const strava = new stravaAPI.client(user.accessToken);

  memo[athleteId] = strava;
  return strava;
}

const getRankedEfforts = (activity) => {
  const rankedEfforts = [];
  if (!activity.segment_efforts) {
    console.log("No Segment efforts on Activity");
    return [];
  }

  activity.segment_efforts.forEach((effort) => {
    if (effort.kom_rank <= 10 && effort.kom_rank > 0) {
      // console.log(`Saving Effort:${effort.name} with Rank:${effort.kom_rank}`);
      rankedEfforts.push(effort);
    }
  });

  return rankedEfforts;
};

function stravaRate() {
  const rateLimits = stravaAPI.rateLimiting;
  if (rateLimits.shortTermUsage + rateLimits.longTermUsage === 0) return 0;
  const stravaRate = rateLimits.fractionReached();

  const percent = (stravaRate * 100).toFixed(2);
  return percent;
}

async function getStravaClient() {
  const refreshToken = config.client_refresh;
  const result = await stravaAPI.oauth.refreshToken(refreshToken);
  const expiresAt = dayjs.unix(result.expires_at);

  const localTime = expiresAt.format("hh:mm A");
  const gmtTime = expiresAt.utc().format("hh:mm");

  console.log(`App Token Expires at: ${localTime} (${gmtTime}GMT),`);

  console.log(expiresAt.fromNow());

  _APP_STRAVA = new stravaAPI.client(result.access_token);
}

async function deleteAllActivities() {
  let count = 1;
  let round = 0;
  while (count > 0) {
    const activities = await db.popActivities(25);
    count = activities.length;
    await db.deleteActivities(activities.map((a) => a.id));
    round++;
    console.info("round: ", round);
  }
}

async function updateUserRefreshToken(athleteId, refreshToken) {
  const user = await db.getUser(athleteId);
  if (user && user.refreshToken !== refreshToken) {
    user.refreshToken = refreshToken;
    db.updateUser(user);
  }
}

module.exports = stravaQueue;
