const config = require("../../src/config/keys");
const db = require("../models/db/dataLayer");
// const m = require("moment");
const dayjs = require("../utils/dayjs");
const stravaQ = require("./stravaQueue");
const ActivityQueue = require("./classes/ActivityQueue");

//services
const { fetchActivities } = require("./summaryServices");

var stravaAPI = require("strava-v3");
stravaAPI.config({
  client_id: config.client_id,
  client_secret: config.client_secret,
  redirect_uri: config.redirect_uri,
});

//Won't need this once the push sub is working properly
async function updateAllUserSinceLast() {
  console.log("---------------------Doing Cron Stuff----------------");
  const users = await db.getAllUsers();
  console.log("users: ", users);

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    await fetchNewUserActivities(user);
  }
  console.log("update finish");
}

async function fetchNewUserActivities(user) {
  try {
    console.info("Checking user refreshToken for user:", user.id);
    const result = await stravaAPI.oauth.refreshToken(user.refreshToken);
    console.log("result: ", result);
    ActivityQueue.updateUserRefreshToken(user.id, result);
    //TODO - this logic should be done elsewhere...
    user.accessToken = result.access_token;
    user.expiresAt = result.expires_at;
  } catch (error) {
    console.error("Error refreshing token");
    console.error(error.message);
    return;
  }
  const update = dayjs(user.lastUpdate);
  const unixTime = update.unix();
  const strava = new stravaAPI.client(user.accessToken);

  try {
    await addToActivityQueue(strava, unixTime);
  } catch (error) {
    console.error("Error Adding to activityQ");
    console.error(error.message);
    return;
  }

  user.lastUpdate = dayjs().format();
  try {
    await db.updateUser(user);
    console.log("User updated:", user);
  } catch (err) {
    console.error("Update user Error");
    console.error(err.message);
    return;
  }
}

function getUserData(res) {
  const user = res.locals.user;
  const accessToken = res.locals.accessToken;
  const refreshToken = res.locals.refreshToken;
  const userData = {
    id: user.athleteId,
    accessToken,
    refreshToken,
  };
  return userData;
}

async function addToActivityQueue(strava, afterDate = 0) {
  try {
    const result = await fetchActivities(strava, afterDate, 2550000000);
    //March + April Rides
    // const result = await summaryStrava.fetchActivities(strava, 1585724400, 1588220022);
    //2020 Rides
    // const result = await summaryStrava.fetchActivities(strava, 1577865600, 1588539708);
    // 1 result
    // const result = await summaryStrava.fetchActivities(strava, 1588057200, 1588220022);

    //TODO - this runs up against the DB provision limits...throttle this.

    await result.forEach(async (activity) => {
      if (!activity.line) return; //skip activities with no line
      await db.addActivity(activity.id, activity.athleteId);
    });
    console.log("Done Adding to DB");
  } catch (error) {
    console.error("Error while Adding to activity table:", error.message);
    //Do nothing for now, add event emitter here if this starts to become a problem
  }
}

module.exports = {
  getUserData,
  updateAllUserSinceLast,
  addToActivityQueue,
};
