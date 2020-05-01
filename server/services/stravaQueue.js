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
  //check strava rate
  //if less than .75 proceed
  const stravaRate = stravaAPI.rateLimiting.fractionReached();

  if (stravaRate > 0.75) return;

  //get segment path
  //get activity details
}

async function getActivityDetails() {
  const memo = {};
  const activities = await db.popActivities();

  activities.forEach(async (activity) => {
    const athleteId = activity.athleteId;
    const strava = await getClient(athleteId, memo);

  });
}

async function parseActivity(id) {
  //get Activity from strava
  //run through segments
  //get kom_ranked
  // add to segmentRank DB
  // add to segmentDetails
  //return pass/fail
}

function getClient(athleteId, memo) {}

module.exports = stravaQueue;
