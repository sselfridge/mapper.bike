const summaryStrava = require("./summaryStrava");
const db = require("../db/dataLayer");
const m = require("moment");
const config = require("../../src/config/keys");

var stravaAPI = require("strava-v3");
stravaAPI.config({
  client_id: config.client_id,
  client_secret: config.client_secret,
  redirect_uri: config.redirect_uri,
});

const segmentController = {
  test,
  cronUpdateSegments,
  segmentEfforts,
  initializeUser,
  updateUserDB,
  getUser,
  deleteUser,
};

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
    const result = await stravaAPI.oauth.refreshToken(user.refreshToken);
    console.log("Refresh Token result =====================================");
    console.log(result);
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

async function updateUserDB(req, res, next) {
  console.log("updating user in DB");
  const userData = getUserData(res);

  try {
    await db.updateUser(userData);
  } catch (err) {
    res.locals.err = err;
    return next();
  }
  return next();
}

async function initializeUser(req, res, next) {
  console.log("initialize User");
  try {
    const strava = res.locals.strava;
    const userData = getUserData(res);
    userData.startDate = m().format();
    userData.lastUpdate = m().format();
    await db.addUser(userData);

    //kick_off get activities
    addToActivityQueue(strava);
    const count = await totalUserActivities(strava, res.locals.user.athleteId);
    res.locals.data = { activityCount: count };
    return next();
  } catch (err) {
    console.log("Initialize Error:");
    console.log(err);
    res.locals.err = err;
    return next();
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

async function getUser(req, res, next) {
  const id = parseInt(req.params.id);
  try {
    const user = await db.getUser(id);
    res.locals.user = user;
    next();
  } catch (error) {
    res.locals.err = "Error Fetching User";
    console.error(error);
    next();
  }
}

async function segmentEfforts(req, res, next) {
  const athleteId = res.locals.user.athleteId;
  const rank = parseInt(req.query.rank ? req.query.rank : 1);
  const efforts = await db.getEffortsWithPath(athleteId, rank);
  console.log(`Got ${efforts.length} efforts with details`);
  res.locals.segmentEfforts = efforts;
  next();
}

async function totalUserActivities(strava, id) {
  const result = await strava.athletes.stats({ id });
  const count = result.all_ride_totals.count + result.all_run_totals.count;
  return count;
}

async function addToActivityQueue(strava, afterDate = 0) {
  try {
    const result = await summaryStrava.fetchActivitiesFromStrava(strava, afterDate, 2550000000);
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

async function deleteUser(req, res, next) {
  const id = parseInt(req.params.id);

  try {
    if (res.locals.user.athleteId === id) {
      db.deleteUser(id);
      next();
    }
  } catch (error) {
    console.error("Delete User Error");
    console.error(error);
    res.locals.err = "Delete User Error";
    next();
  }
}

async function test(req, res, next) {
  if (process.env.NODE_ENV === "production") {
    // keep those not me from hitting the test endpoint in prod
    if (!res.locals.user?.athleteId || res.locals.user.athleteId !== 1075670) {
      res.locals.err = "Not authorized for testing";
      return next();
    }
  }
  console.log("Start Test");
  const strava = res.locals.strava;

  const stravaSub = require("strava-v3");

  stravaSub.config({
    client_id: config.client_id,
    client_secret: config.client_secret,
  });

  try {
    stravaSub.pushSubscriptions
      .list()
      // .create({
      //   callback_url: "http://9d6b-184-187-181-40.ngrok.io/api/gethook",
      //   verify_token: "1243567ui7tkuyjrrg34e5rut65",
      // })
      // .delete({
      //   id: 200199,
      // })
      .then((res) => {
        console.log("res: ", res);

        console.log("prom Done");
        next();
      })
      .catch((err) => {
        console.log(err.error.message);
        console.log(err.error.errors);
        console.log("sub Error");
        next();
      });
    return;
    // const result = await strava.segments.listLeaderboard({ id: 8058447 });
    // const result = await strava.athlete.get({});
    // const result = await db.deleteUser(10645041);

    // const result = await summaryStrava.fetchActivitiesFromStrava(strava, 1590896066, 2599372000);
    // const result = await strava.activities.get({ id: 3593303190, include_all_efforts: true });
    // const result = await strava.segments.get({ id: 16616440 });
    // const result = await cronUpdateSegments();
    // const result = await db.deleteUser(1075670);
    // const result = await strava.activities.get({ id: 3462588758 });
    console.log("Done! Did this still work?");
  } catch (err) {
    console.log("CRAP!!!");
    console.log(err.message);
    res.locals.err = "AAAAAAAAA";
  }

  console.log("Test Done");
  // next();
}

module.exports = segmentController;
