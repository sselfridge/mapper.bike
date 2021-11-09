const config = require("../../src/config/keys");
const db = require("../models/db/dataLayer");
// const m = require("moment");
const dayjs = require("../utils/dayjs");

//models
const Activity = require("../models/Activity");
const User = require("../models/User");

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
  console.log("User: ", User);
  console.log("User: ", Object.keys(User));
  const users = await User.getAll();
  console.log("users: ", users);
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    await fetchNewUserActivities(user);
  }
  console.log("update finish");
}

async function fetchNewUserActivities(user) {
  const update = dayjs(user.lastUpdate);
  const after = update.unix();

  try {
    await Activity.addToActivityQueue(user, after);
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
