const SegmentQueue = require("./classes/SegmentQueue");
const ActivityQueue = require("./classes/ActivityQueue");

const User = require("../models/User");

const _stravaAPI = global._stravaAPI;

const stravaQueue = {
  processQueue,
  updateUserRefreshToken,
};

async function processQueue() {
  console.log("Process Queue");

  let stravaRatePercent = await stravaRate();
  console.log("stravaRatePercent: ", stravaRatePercent);

  const activityQ = new ActivityQueue();
  const segmentQ = new SegmentQueue();

  while (stravaRatePercent < 75) {
    let processed = 0;
    try {
      processed += await activityQ.process();
      processed += await segmentQ.process();
    } catch (error) {
      console.log("Queue Error:", error.message);
      console.log(error);
      break;
    }
    stravaRatePercent = await stravaRate();
    console.log(`Strava Rate currently at: ${stravaRatePercent}%`);
    if (processed === 0) break;
  } //while

  console.log("Process Done");
}

function stravaRate() {
  const rateLimits = _stravaAPI.rateLimiting;
  if (rateLimits.shortTermUsage + rateLimits.longTermUsage === 0) return 0;
  const stravaRate = rateLimits.fractionReached();

  const percent = (stravaRate * 100).toFixed(2);
  return percent;
}

async function updateUserRefreshToken(athleteId, result) {
  const user = await User.get(athleteId);
  if (user) {
    user.expiresAt = result.expires_at;
    user.refreshToken = result.refresh_token;
    user.accessToken = result.access_token;
    User.update(user);
  }
}

module.exports = stravaQueue;
