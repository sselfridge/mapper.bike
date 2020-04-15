const jwtoken = require("jsonwebtoken");
const m = require("moment");
const Cryptr = require("cryptr");
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

const cryptr = new Cryptr(config.secretSuperKey);

const stravaController = {
  setStravaOauth,
  loadStravaProfile,
  getActivities,
  getDemoData,
  clearCookie,
};

// EXPORTED Functions
function setStravaOauth(req, res, next) {
  let code = req.query.code;
  console.log(`Strava Code: ${code}`);

  stravaAPI.oauth
    .getToken(code)
    .then((result) => {
      let payload = {
        expiresAt: result.expires_at,
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

function loadStravaProfile(req, res, next) {
  console.log("loadStravaProfile");
  const jwt = decryptJwt(req.cookies.stravajwt);

  checkStravaClient(res, jwt)
    .then(checkRefreshToken)
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
      clearCookie(req, res, next);
      next();
    });
}

function clearCookie(req, res, next) {
  console.log("clear cookie: stravajwt");
  res.clearCookie("stravajwt", { httpOnly: true });
  next();
}

// fetch activities in the date range between before and after
// activities stored in res.locals.activities in polyline format
// need to turn into points to be placed on map
// done by getPointsFromActivites
function getActivities(req, res, next) {
  const after = req.query.after;
  const before = req.query.before;
  const activityType = req.query.type;
  console.log(`Type:${activityType}`);

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

// Utility Functions
// Not middleware for requests, but more complex than basic untility

const checkStravaClient = (res, jwt) => {
  return new Promise((resolve, reject) => {
    jwtoken.verify(jwt, config.secretSuperKey, (err, payload) => {
      if (err) return reject("JWT / Cookie Invalid");
      console.log(`JWT Valid - allow to proceed. athleteID: ${payload.athleteID}`);
      res.locals.expiresAt = m.unix(payload.expiresAt);
      res.locals.strava = new stravaAPI.client(payload.accessToken);
      res.locals.accessToken = payload.accessToken;
      res.locals.refreshToken = payload.refreshToken;
      res.locals.athleteID = payload.athleteID;
      console.log("Access Token: ", res.locals.accessToken);
      return resolve(res);
    });
  });
};

//check if the accesstoken is expired, if so request a new one
const checkRefreshToken = (res) => {
  return new Promise((resolve, reject) => {
    const expiresAt = res.locals.expiresAt;
    console.log(`Token Expires at ${expiresAt.format("hh:mm A")},`, expiresAt.fromNow());
    console.log("Refresh Token:", res.locals.refreshToken);
    if (m().isBefore(expiresAt)) {
      console.log("Token Not Expired");
      return resolve();
    } else {
      console.log("Token Expired");

      stravaAPI.oauth
        .refreshToken(res.locals.refreshToken)
        .then((result) => {
          let payload = {
            expiresAt: result.expires_at,
            refreshToken: result.refresh_token,
            accessToken: result.access_token,
            athleteID: res.locals.athleteID,
          };
          setJWTCookie(res, payload);
          res.locals.expiresAt = result.expires_at;
          res.locals.accessToken = result.access_token;
          res.locals.strava = new stravaAPI.client(result.access_token);
          return resolve();
        })
        .catch((err) => {
          console.log("Error During Token Refresh");
          console.log(err);
          reject("Error During Token Refresh");
        });
    }
  });
};

// let payload = {
//   expiresAt,
//   refreshToken,
//   accessToken,
//   athleteID
// };
function setJWTCookie(res, payload) {
  console.log("Set JWT", payload);
  const jwt = jwtoken.sign(payload, config.secretSuperKey);
  const crypted = cryptr.encrypt(jwt);
  res.cookie("stravajwt", crypted, { httpOnly: true });
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
    newActivity.date = utils.makeEpochSecondsTime(element.start_date_local);
    newActivity.distance = element.distance;
    newActivity.elapsedTime = element.elapsed_time;
    newActivity.selected = false;
    newActivity.weight = 2;
    newActivity.color = "blue";

    //only grab activities with a polyline AKA non-trainer rides
    if (newActivity.line) {
      if (activityType === "Ride") {
        if (element.type === "Ride") activities.push(newActivity);
      } else {
        activities.push(newActivity);
      }
    }
  });
  return activities;
}

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

function decryptJwt(jwt) {
  let hubCookie;
  try {
    //this fails badly if the key is wrong
    hubCookie = cryptr.decrypt(jwt);
  } catch (error) {
    hubCookie = "This Will Fail";
  }
  return hubCookie;
}

function errorDispatch(err, req, res, next) {
  console.log(`ERROR Will Robinson! ASYNC ERROR`);
  console.log(err);
  res.locals.err = "err";
  next();
}

module.exports = stravaController;
