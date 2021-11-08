const config = require("../../src/config/keys");
const db = require("../models/db/dataLayer");
// const m = require("moment");
const dayjs = require("../utils/dayjs");

//models
const Activity = require("../models/Activity");

//classes
const ActivityQueue = require("./classes/ActivityQueue");

//services

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
    await Activity.addToActivityQueue(strava, unixTime);
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

module.exports = {
  updateAllUserSinceLast,
};
