const jwtoken = require("jsonwebtoken");
const m = require("moment");
const Cryptr = require("cryptr");
const request = require("request");
const fs = require("fs");
const db = require("../db/segments");

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

const cryptr = new Cryptr(config.secretSuperKey);

const stravaController = {
  getActivities,
  getSegments,
  getDemoData,
  clearCookie,
  getActivityDetail,
  status: {},
};

// fetch activities in the date range between before and after
// activities stored in res.locals.activities in polyline format
// need to turn into points to be placed on map
// done by getPointsFromActivities
function getActivities(req, res, next) {
  const after = req.query.after;
  const before = req.query.before;
  const activityType = JSON.parse(req.query.type);
  const kind = req.query.kind;

  pingStrava(after, before, res.locals.accessToken)
    .then((result) => {
      result = cleanUpStravaData(result, activityType);
      console.log(`Cleaned up result length: ${result.length}`);

      res.locals.activities = decodePoly(result);
      return next();
    })
    .catch((err) => errorDispatch(err, req, res, next));
}

function getDemoData(req, res, next) {
  console.log("Getting Demo Data");
  const demoData = fs.readFileSync(__dirname + `/../../config/demoData.json`);
  let stravaData = JSON.parse(demoData);
  console.log(`Cleaning up from demoData`);
  const result = cleanUpStravaData(stravaData);
  res.locals.activities = decodePoly(result);

  return next();
}

function getSegments(req, res, next) {
  return next();
}

async function getActivityDetail(req, res, next) {
  const strava = res.locals.strava;

  const after = 1556348200;
  const before = 1588048677;

  try {
    const result = await fetchActivitiesFromStrava(strava, after, before);
    if (Array.isArray(result)) {
      console.log("Array out!");
      console.log(result.length);
      console.log(result[0]);
    } else {
      console.log("non Array");
      console.log(result);
    }
    const cleanedUpResult = cleanUpStravaData(result, {
      Ride: true,
      VirtualRide: false,
      Run: false,
    });
    res.locals.activities = decodePoly(cleanedUpResult);
    next();
  } catch (err) {
    console.log("");
    res.locals.activities = [];
    errorDispatch(err, req, res, next);
  }

  // db.getEmptyActivities()
  // .then(results => {
  //   results.Items.forEach(result =>{
  //     const id = result.id;
  //     strava.activities.get({ id }).then((activity) => {
  //       activity.date = utils.makeEpochSecondsTime(activity.start_date)
  //       let rate = strava.rateLimiting
  //       console.log(`Strava Rate:`);
  //       console.log(rate);
  //       activity.segment_efforts.forEach(effort =>{
  //         if(effort.kom_rank !== null){
  //           db.addSegmentEffort(effort);
  //         }
  //       })

  //       db.addActivity(activity)
  //     });
  //   })

  //   next();
  // })

  // db.getPathlessSegments().then((segments) => {
  //   segments.Items.forEach((segment) => {
  //     strava.segments.get({ id: segment.id }).then((fullSegment) => {
  //       fullSegment.rank = segment.rank;
  //       db.addSegment(fullSegment);
  //     });
  //   });

  //   next();
  // });

  // db.getAllSegments().then((segments) => {
  //   const newSegments = [];
  //   segments.Items.forEach((segment) => {
  //     const newActivity = {};
  //     newActivity.id = segment.id;
  //     newActivity.name = segment.name;
  //     newActivity.line = segment.path;
  //     newActivity.date = utils.makeEpochSecondsTime(segment.date);
  //     newActivity.distance = segment.distance;
  //     newActivity.elapsedTime = segment.elapsedTime;
  //     newActivity.selected = false;
  //     newActivity.weight = 2;
  //     newActivity.color = "blue";
  //     newSegments.push(newActivity);
  //   });
  //   res.locals.segments = decodePoly(newSegments);
  //   next();
  // });

  // const id = 3255989795;

  // strava.activities.get({ id }).then((activity) => {
  //   activity.date = utils.makeEpochSecondsTime(activity.start_date)

  //   activity.segment_efforts.forEach(effort =>{
  //     if(effort.kom_rank !== null){
  //      //TODO add effort date to segment info
  //       db.addSegmentEffort(effort);
  //     }
  //   })

  //   db.addActivity(activity)
  //   next();
  // });
  // db.getEmptyActivities()
  //   .then((activities) => fetchActivityDetails(activities, res))

  //   .then((result) => {
  //     console.log("result");
  //     console.log(result);
  //     next();
  //   });
}

// Utility Functions
// Not middleware for requests, but more complex than basic untility

function clearCookie(req, res, next) {
  console.log("clear cookie: mapperjwt");
  res.clearCookie("mapperjwt", { httpOnly: true });
  next();
}

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
  console.log("Post Awiat;", activities);
  return activities;
}


async function fetchActivitiesRecursivly(params, r) {
  const page = params.page;
  console.log(`Recursive Call:${params.page}`);
  resultActivities = await r.strava.athlete.listActivities(params);

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

function pingStrava(after, before, accessToken) {
  console.log("Ping Strava with accessToken:", accessToken);
  return new Promise((resolve, reject) => {
    let stravaData = [];
    const queryData = {
      page: 1,
      query: `https://www.strava.com/api/v3/athlete/activities?&after=${after}&before=${before}&per_page=200&page=`,
      accessToken: accessToken,
    };

    //build callback for recusrive strava calls
    const callback = function (err, resultStravaArray) {
      if (err) {
        console.log(`Error with strava ${err}`);
        return reject([]);
      } else {
        return resolve(resultStravaArray);
      }
    };

    //initial call to get data, will call itself recursivly until it reaches the end of data
    buildStravaData(queryData, stravaData, callback);
  });
}

// prettier-ignore
function buildStravaData(queryData, stravaData,  callback) {
  let stravaQuery = queryData.query + queryData.page;
  console.log(stravaQuery);
  console.log(
    `========================CALLING STRAVA API==============================`
  );
  request.get(
    {
      url: stravaQuery,
      headers: {
        Authorization: `Bearer ${queryData.accessToken}`
      }
    },
    function(err, httpResponse, body) {
      if (httpResponse.statusCode !== 200) {
        callback(body);
        return;
      }
      console.log(`Strava Data Aquired!!`);
      let newData = JSON.parse(body);
      let newLength = newData.length;
      console.log(`Got ${newLength} new results`);
      stravaData = stravaData.concat(newData);

      if (newLength !== 200) {
        console.log(`less than 200 results`);
        callback(null,stravaData) ;
      } else {
        console.log('More than 200 results, getting more');
        // prettier-ignore
        queryData.page++;
        buildStravaData(queryData,stravaData,callback);      
      }
    }
  );
}

//take the activity summary data from strava and parse it for display on the map
function cleanUpStravaData(stravaData, activityType) {
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
        // db.addActivity(newActivity);
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

module.exports = stravaController;
