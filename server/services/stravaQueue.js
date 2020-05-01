const config = require("../../config/keys");
const db = require("../db/dataLayer");

var stravaAPI = require("strava-v3");
stravaAPI.config({
  // "access_token"  : "Your apps access token (Required for Quickstart)",
  client_id: config.client_id,
  client_secret: config.client_secret,
  redirect_uri: config.redirect_uri,
});

const stravaQueue = {
  processQueue,
  parseActivity,
};

async function processQueue() {
  console.log("Process Queue");
  //check strava rate
  //if less than .75 proceed
  const stravaRate = stravaAPI.rateLimiting.fractionReached();
  console.log("Strava Rate:==========================", stravaRate);
  if (stravaRate > 0.75) return;

  await getActivityDetails();

  //get segment path
}

async function getActivityDetails() {
  console.log("Get Activity Details");
  const memo = {};
  const activities = await db.popActivities();

  for (const activity of activities) {
    const athleteId = activity.athleteId;
    const strava = await getClient(athleteId, memo);

    console.log("Getting Full Activity");
    // console.log(strava);

    console.log("----------------------------------------------------------");

    //TODO remove hardcoding here
    const fullActivity = await strava.activities.get({ id: 3352762323, include_all_efforts: true });

    parseActivity(fullActivity);
  }
}

async function parseActivity(activity) {
  console.log("Got full Act:", activity.name);
  const rankedSegments = getRankedSegments(activity);
  db.storeSegments(rankedSegments);
  // add to segmentRank DB
  // add to segmentDetails
  //return pass/fail
}

async function getClient(athleteId, memo) {
  if (memo[athleteId]) return memo[athleteId];

  const user = await db.getUser(athleteId);
  console.log("user");
  console.log(user);
  const strava = new stravaAPI.client(user.accessToken);
  memo[athleteId] = strava;
  return strava;
}

const getRankedSegments = (activity) => {
  console.log("Getting Ranked Segments");
  const rankedSegments = [];
  if (!activity.segment_efforts) {
    console.log("No Segment efforst on Activity");
    return [];
  }

  console.log("Segments on this Activity:", activity.segment_efforts.length);

  activity.segment_efforts.forEach((effort) => {
    if (effort.kom_rank !== null) {
      console.log(effort.kom_rank);
      rankedSegments.push(effort);
    }
  });
};

module.exports = stravaQueue;
