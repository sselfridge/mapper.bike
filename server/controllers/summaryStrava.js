
const request = require("request");
const fs = require("fs");

const decodePolyline = require("decode-google-map-polyline");

const config = require("../../config/keys");
const utils = require("../utils/stravaUtils");

var stravaAPI = require("strava-v3");
stravaAPI.config({
  // "access_token"  : "Your apps access token (Required for Quickstart)",
  client_id: config.client_id,
  client_secret: config.client_secret,
  redirect_uri: config.redirect_uri,
});

// DB requirments, not being used but keeping around for the future
// const Activity = require("./../models/activityModel");
// const mongoose = require("mongoose");


const summaryController = {
  getSummeries,
  getDemoData,
  fetchActivitiesFromStrava,
  status: {},
};

// fetch activities in the date range between before and after
// activities stored in res.locals.activities in polyline format
// need to turn into points to be placed on map
// done by getPointsFromActivities
async function getSummeries(req, res, next) {
  const after = req.query.after;
  const before = req.query.before;
  const activityType = JSON.parse(req.query.type);

  const strava = res.locals.strava;

  try {
    const result = await fetchActivitiesFromStrava(strava, after, before);
    const cleanedUpResult = mapAndFilterStravaData(result, activityType);
    res.locals.activities = decodePoly(cleanedUpResult);
    next();
  } catch (err) {
    res.locals.activities = [];
    errorDispatch(err, req, res, next);
  }

  // pingStrava(after, before, res.locals.accessToken)
  //   .then((result) => {
  //     result = mapAndFilterStravaData(result, activityType);
  //     console.log(`Cleaned up result length: ${result.length}`);

  //     res.locals.activities = decodePoly(result);
  //     return next();
  //   })
  //   .catch((err) => errorDispatch(err, req, res, next));
}

function getDemoData(req, res, next) {
  console.log("Getting Demo Data");
  const demoData = fs.readFileSync(__dirname + `/../../config/demoData.json`);
  let stravaData = JSON.parse(demoData);
  console.log(`Cleaning up from demoData`);
  const result = mapAndFilterStravaData(stravaData);
  res.locals.activities = decodePoly(result);

  return next();
}

// Utility Functions
// Not middleware for requests, but more complex than basic untility



// let payload = {
//   expiresAt,
//   refreshToken,
//   accessToken,
//   athleteID
// };

async function fetchActivitiesFromStrava(strava, after, before) {
  const params = { after, before, page: 1, per_page: 200 };
  const r = { strava, activities: [] };
  const activities = await fetchActivitiesRecursivly(params, r);
  return activities;
}


async function fetchActivitiesRecursivly(params, r) {
  const page = params.page;
  console.log(`Recursive Call:${params.page}`);
  const resultActivities = await r.strava.athlete.listActivities(params);

  r.activities = r.activities.concat(resultActivities);
  if (resultActivities.length < 200) {
    console.log("Recursive Call End", page);
  } else {
    console.log("We have go to deeper", page);
    params.page++;
    await fetchActivitiesRecursivly(params, r);
  }

  console.log("End of this Func", page);
  console.log(r.activities.length);
  return r.activities;
}

function mapAndFilterStravaData(stravaData, activityType) {
  console.log(`cleaning up ${stravaData.length} entries`);
  let activities = [];
  // console.log(stravaData[0]); //uncomment to view stravaData format
  stravaData.forEach((element) => {
    //see config/dataNotes.js for element data types
    const newActivity = {};
    newActivity.id = element.id;
    newActivity.name = element.name;
    newActivity.line = element.map.summary_polyline;
    newActivity.date = utils.makeEpochSecondsTime(element.start_date_local);
    newActivity.distance = element.distance;
    newActivity.elapsedTime = element.elapsed_time;
    newActivity.selected = false;
    newActivity.weight = 2;
    newActivity.color = "blue";

    //only grab activities with a polyline AKA non-trainer rides
    if (newActivity.line) {
      if (activityType === undefined || activityType[element.type] === true) {
        activities.push(newActivity);
      }
    }
  });
  return activities;
}

const fetchActivityDetails = (activitiesFromDB, res) => {
  const strava = res.locals.strava;
  const activityIds = activitiesFromDB.Items.map((act) => parseInt(act.id.N));
  return new Promise((resolve, reject) => {
    let rate = strava.rateLimiting.fractionReached();
    while (rate < 0.75) {
      const result = strava.activities.get({ id: 3189689567 }).then((result) => {
        console.log("result");
        console.log(Object.keys(result));
        console.log("Strave Rate Limits");
        console.log(strava.rateLimiting.fractionReached());
      });
    }
  });
};

const decodePoly = (activities) => {
  // take polyline and decode into GPS points to be placed on map in polyline component
  // ya I know its weird but here we are
  activities.forEach((activity) => {
    try {
      const decodedPath = decodePolyline(activity.line);
      activity.points = decodedPath;
    } catch (error) {
      console.log(`Error decoding activity: ${activity.name}`);
      console.log(error);
    }
    utils.addMidPoint(activity);
  });

  return activities;
};

function errorDispatch(err, req, res, next) {
  console.log(`ERROR Will Robinson! ASYNC ERROR`);
  console.log(err);
  res.locals.err = "err";
  next();
}

module.exports = summaryController;
