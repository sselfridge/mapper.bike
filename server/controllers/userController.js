const User = require("../models/User");
const Effort = require("../models/Effort");
const Activity = require("../models/Activity");
const Segment = require("../models/Segment");

const userServices = require("../services/userServices");

const dayjs = require("../utils/dayjs");

async function initializeUser(req, res, next) {
  console.log("initialize User");
  try {
    const strava = res.locals.strava;
    const userData = userServices.getUserData(res);
    userData.startDate = dayjs().format();
    userData.lastUpdate = dayjs().format();
    userData.expiresAt = dayjs().unix() - 5;
    await User.add(userData);

    //kick_off get activities
    const activities = await User.fetchActivitiesAfter(userData, 0);
    await Activity.add(activities, userData.id);

    const count = await userServices.totalUserActivities(
      strava,
      res.locals.user.athleteId
    );
    res.locals.data = { activityCount: count };
    return next();
  } catch (err) {
    console.log("Initialize Error:");
    console.log(err);
    res.locals.err = err;
    return next();
  }
}

async function getUser(req, res, next) {
  const id = parseInt(req.params.id, 10);
  try {
    const user = await User.get(id);
    res.locals.user = user;
    next();
  } catch (error) {
    res.locals.err = "Error Fetching User";
    console.error(error);
    next();
  }
}

// eslint-disable-next-line require-await
async function deleteUser(req, res, next) {
  const id = parseInt(req.params.id);

  if (res.locals.err) {
    return next();
  }

  try {
    if (res.locals.user.athleteId === id) {
      User.delete(id);
      next();
    }
  } catch (error) {
    console.error("Delete User Error");
    console.error(error);
    res.locals.err = "Delete User Error";
    next();
  }
}

const userController = {
  initializeUser,
  getUser,
  deleteUser,
};

module.exports = userController;
