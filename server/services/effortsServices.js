const config = require("../../src/config/keys");
const db = require("../db/dataLayer");
const m = require("moment");

const stravaQ = require("./stravaQueue");

//services
const { fetchActivitiesFromStrava } = require("./summaryServices");

var stravaAPI = require("strava-v3");
stravaAPI.config({
  client_id: config.client_id,
  client_secret: config.client_secret,
  redirect_uri: config.redirect_uri,
});

//Won't need this once the push sub is working properly
async function cronUpdateSegments() {
  console.log("---------------------Doing Cron Stuff----------------");
  const users = await db.getAllUsers();

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    await updateUserSegments(user);
  }
}

async function updateUserSegments(user) {
  try {
    console.info("Checking user refreshToken for user:", user.id);
    const result = await stravaAPI.oauth.refreshToken(user.refreshToken);
    stravaQ.updateUserRefreshToken(user.id, result.refresh_token);
    user.accessToken = result.access_token;
  } catch (error) {
    console.error("Error refreshing token");
    console.error(error.message);
    return;
  }

  const update = m(user.lastUpdate);
  const unixTime = update.unix();
  const strava = new stravaAPI.client(user.accessToken);

  try {
    await addToActivityQueue(strava, unixTime);
  } catch (error) {
    console.error("Error Adding to activity");
    console.error(error.message);
    return;
  }

  user.lastUpdate = m().format();

  try {
    await db.updateUser(user);
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
    const result = await fetchActivitiesFromStrava(
      strava,
      afterDate,
      2550000000
    );
    //March + April Rides
    // const result = await summaryStrava.fetchActivitiesFromStrava(strava, 1585724400, 1588220022);
    //2020 Rides
    // const result = await summaryStrava.fetchActivitiesFromStrava(strava, 1577865600, 1588539708);
    // 1 result
    // const result = await summaryStrava.fetchActivitiesFromStrava(strava, 1588057200, 1588220022);
    result.forEach(async (activity) => {
      if (!activity.map.summary_polyline) return; //skip activities with no line
      await db.addActivity(activity.id, activity.athlete.id);
    });
    console.log("Done Adding to DB");
  } catch (error) {
    console.error("Error while Adding to activity table:", error.message);
    //Do nothing for now, add event emitter here if this starts to become a problem
  }
}

module.exports = {
  getUserData,
  cronUpdateSegments,
  addToActivityQueue,
};
