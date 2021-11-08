const config = require("../../src/config/keys");
const db = require("../models/db/dataLayer");
// const m = require("moment");
var stravaAPI = require("strava-v3");
const SegmentQueue = require("./classes/SegmentQueue");
const ActivityQueue = require("./classes/ActivityQueue");

stravaAPI.config({
  client_id: config.client_id,
  client_secret: config.client_secret,
  redirect_uri: config.redirect_uri,
});

const stravaQueue = {
  processQueue,
  updateUserRefreshToken,
};

async function processQueue() {
  console.log("Process Queue");

  let stravaRatePercent = await stravaRate();

  const segmentQ = await new SegmentQueue().init();
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
    stravaRatePercent = await stravaRate();
    console.log(`Strava Rate currently at: ${stravaRatePercent}%`);
    if (processed === 0) break;
  } //while

  console.log("Process Done");
}

function stravaRate() {
  const rateLimits = stravaAPI.rateLimiting;
  if (rateLimits.shortTermUsage + rateLimits.longTermUsage === 0) return 0;
  const stravaRate = rateLimits.fractionReached();

  const percent = (stravaRate * 100).toFixed(2);
  return percent;
}

async function updateUserRefreshToken(athleteId, refreshToken) {
  const user = await db.getUser(athleteId);
  if (user && user.refreshToken !== refreshToken) {
    user.refreshToken = refreshToken;
    db.updateUser(user);
  }
}

module.exports = stravaQueue;
