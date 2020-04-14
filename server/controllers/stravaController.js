const jwtoken = require("jsonwebtoken");
const m = require("moment");
const Cryptr = require("cryptr");
const request = require("request");
const fs = require("fs");
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

const stravaController = {};
stravaController.setStravaOauth = setStravaOauth;
stravaController.loadStravaProfile = loadStravaProfile;
stravaController.getActivities = getActivities;
stravaController.getDemoData = getDemoData;
stravaController.clearCookie = clearCookie;

function setStravaOauth(req, res, next) {
  let code = req.query.code;
  console.log(`Strava Code: ${code}`);

  stravaAPI.oauth
    .getToken(code)
    .then((result) => {
      let payload = {
        expires_at: result.expires_at,
        refreshToken: result.refresh_token,
        accessToken: result.access_token,
        athleteID: result.athlete.id,
      };

      setJWTCookie(res, payload);
      next();
    })
    .catch((err) => {
      console.log("Error during Oauth");
      console.log(err);
      next();
    });
}

// let payload = {
//   expires_at,
//   refreshToken,
//   accessToken,
//   athleteID
// };
function setJWTCookie(res, payload) {
  console.log("Set JWT");
  const jwt = jwtoken.sign(payload, config.secretSuperKey);
  const crypted = cryptr.encrypt(jwt);
  res.cookie("stravajwt", crypted, { httpOnly: true });
}



function loadStravaProfile(req, res, next) {
  console.log("loadStravaProfile");
  const jwt = req.cookies.stravajwt;
  let hubCookie;
  try {
    //this fails badly if the key is wrong
    hubCookie = cryptr.decrypt(jwt);
  } catch (error) {
    hubCookie = "This Will Fail";
  }
  jwtoken.verify(hubCookie, config.secretSuperKey, (err, payload) => {
    if (err) {
      console.log(`Token Invalid: ${err}`);
      res.locals.err = "JWT / Cookie token invalid";
      clearCookie(req, res, next);
    } else {
      console.log(`JWT Valid - allow to proceed. athleteID: ${payload.athleteID}`);
      res.locals.expires_at = m.unix(payload.expires_at);
      res.locals.strava = new stravaAPI.client(payload.accessToken);
      res.locals.accessToken = payload.accessToken;
      res.locals.refreshToken = payload.refreshToken;
      res.locals.athleteID = payload.athleteID;
      console.log("Access Token: ", res.locals.accessToken);
      utils.checkAndRefreshStravaClient(res)
        .then(() => res.locals.strava.athlete.get({}))
        .then((result) => {
          res.locals.user = {
            avatar: result.profile,
            firstname: result.firstname,
            lastname: result.lastname,
          };

          utils.logUser(result.firstname, result.lastname);
          next();
        })
        .catch((err) => {
          console.log("Error while trying to refresh Token\n", err.message);
          res.locals.err = "Error During Token Refresh";
          next();
        });
    }
  });
}

function clearCookie(req, res, next) {
  console.log("clear cookie: stravajwt");
  res.clearCookie("stravajwt", { httpOnly: true });
  next();
}
// Not using DB currently, keeping old code if we move to that in the future

//activity not in db already - create new activity and insert
// function putActivityinDB(activity) {
//   const newAct = new Activity(activity);
//   let reterr = null;
//   try {
//     //try catch because my duplication errors are annoying
//     newAct.save(err => {
//       if (err) {
//         console.log("Error Creating Activity:", err);
//         let errMsg;
//         switch (err.code) {
//           case 11000:
//             // do nothing, expecting lots of dupications
//             // errMsg = "None unique Activity taken, please pick something else";
//             err = null;
//             break;

//           default:
//             errMsg = "Error creating Activity, try again later";
//             break;
//         }
//         err = errMsg;
//       }
//     });
//   } catch (error) {
//     console.log(`Caught a DB error: ${error}`);
//   }
//   // return reterr;
// }

// function fetchFromDB(after, before, accessToken) {
//   return new Promise((resolve, reject) => {
//     resolve([accessToken]); //ignore DB for now
//     return;
//     console.log("This Shouldn't happen&&&&&&&&&&&&&&&&&&&&&&&&&");
//     Activity.find({ date: { $lte: before, $gte: after } }, (err, docs) => {
//       console.log(`Searching DB`);
//       if (err) {
//         console.log(`Error with DB: ${err}`);
//         resolve([], accessToken);
//       } else {
//         console.log(`Found docs from DB: ${docs.length}`);
//         let newActivityArray = [];
//         docs.forEach(activity => {
//           const newActivity = {
//             id: activity.id,
//             name: activity.name,
//             line: activity.line,
//             date: activity.date,
//             color: activity.color,
//             selected: activity.selected
//           };
//           newActivityArray.push(newActivity);
//         });

//         //do we have all the dates in our DB already?
//         resolve(newActivityArray, accessToken);
//       }
//     }); //dnif
//   });
// }

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
        buildStravaData(queryData,stravaData,callback);      }
    }
  );
}

//take the activity data from strava and parse it for display on the map
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
    newActivity.date = makeEpochSecondsTime(element.start_date_local);
    newActivity.distance = element.distance;
    newActivity.elapsedTime = element.elapsed_time;
    newActivity.selected = false;
    newActivity.weight = 2;
    newActivity.color = "blue";

    //only grab activities with a polyline
    if (newActivity.line) {
      // if (!dbSet.has(newActivity.id)) { //TODO re-introduce DB stuffs
      //   dbSet.add(newActivity.id);
      //   let err = putActivityinDB(newActivity);
      //   if (err) console.error("Error with DB stuff", err);
      // }
      if (activityType === "Ride") {
        if (element.type === "Ride") activities.push(newActivity);
      } else {
        activities.push(newActivity);
      }
    }
  });
  return activities;
}

// takes a string that represnts a date and returns the epoch time in seconds
// "2012-02-15T21:20:29Z" --> 1329340829
function makeEpochSecondsTime(timeString) {
  const date = new Date(timeString);
  const seconds = Math.floor(date.getTime() / 1000);
  return seconds;
}

// fetch activities in the date range between before and after
// activities stored in res.locals.activities in polyline format
// need to turn into points to be placed on map
// done by getPointsFromActivites
function getActivities(req, res, next) {
  after = req.query.after;
  before = req.query.before;
  activityType = req.query.type;
  console.log(`Type:${activityType}`);

  pingStrava(after, before, res.locals.accessToken)
    .then((result) => {
      result = cleanUpStravaData(result, activityType);
      console.log(`Cleaned up result length: ${result.length}`);

      res.locals.activities = utils.decodePoly(result);
      return next();
    })
    .catch((err) => errorDispatch(err, req, res, next));
}

function getDemoData(req, res, next) {
  console.log("Getting Demo Data");
  const demoData = fs.readFileSync(__dirname + `/../../config/demoData.json`);
  let stravaData = JSON.parse(demoData);
  console.log(`Cleaning up from demoData`);
  result = cleanUpStravaData(stravaData);
  res.locals.activities = utils.decodePoly(result);

  return next();
}

function errorDispatch(err, req, res, next) {
  console.log(`ERROR Will Robinson! ASYNC ERROR`);
  console.log(err);
  res.locals.err = "err";
  next();
}

module.exports = stravaController;
