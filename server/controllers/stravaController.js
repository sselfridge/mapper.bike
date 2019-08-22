const Activity = require("./../models/activityModel");
const jwtoken = require("jsonwebtoken");
const request = require("request");
const decodePolyline = require("decode-google-map-polyline");
const fs = require("fs");
const mongoose = require("mongoose");
const dayInSeconds = 86400;
const dbSet = new Set();

const config = require("../../config/keys");

let needToPingStrava = false; //flag if we need to make a strava querey or if we have all activities locally
let useDummyData = false;

//globals that I shouldn't use but meh
let before;
let after;

const secretSuperKey = config.secretSuperKey; //used for JWT stuffs

const stravaController = {};
stravaController.setStravaOauth = setStravaOauth;
stravaController.loadStravaProfile = loadStravaProfile;
stravaController.getActivities = getActivities;
stravaController.getDemoData = getDemoData;
stravaController.clearCookie = clearCookie;
stravaController.getPointsFromActivities = getPointsFromActivities;

function setStravaOauth(req, res, next) {
  let stravaCode = req.query.code;
  console.log(`Strava Code: ${stravaCode}`);

  request.post(
    {
      url: "https://www.strava.com/oauth/token",
      form: {
        client_id: config.client_id,
        client_secret: config.client_secret,
        grant_type: "authorization_code",
        code: stravaCode
      }
    },
    function(err, httpResponse, body) {
      if (err) {
        console.log(`Error with strava auth ${err}`);
        res.locals.err =
          "Error with strava - try again or logging with username/password";
        return next();
      }

      // No error but can still be a bad request ie status code 400
      if (httpResponse.statusCode != 200) {
        console.log(`Status Code: ${httpResponse.statusCode}: Body:${body}`);
        return next();
      }
      tokenRegex = /refresh_token":"([^"]+).*access_token":"([^"]+).*"athlete":{"id":(\d+)/;
      bodyArray = tokenRegex.exec(body);
      // console.log(`body`);
      // console.log(body);
      // console.log(`Refresh Token: ${bodyArray[1]}`);
      // console.log(`accessToken: ${bodyArray[2]}`);
      // console.log(`Athlete Number: ${bodyArray[3]}`);
      // "{"token_type":"Bearer","access_token":"adaa94e12ea9e8d3c85ea3cd6932a7ff833b3f30",
      // "athlete":{"id":1075670,"username":"sirclesam","resource_state":2,"firstname":"Sam "
      // ,"lastname":"Wise | LG","city":"Los Angeles","state":"California",
      // "country":"United States","sex":"M","premium":true,"summit":true,
      // "created_at":"2012-09-06T17:53:52Z","updated_at":"2019-04-20T13:03:34Z"
      // ,"badge_type_id":1,
      // "profile_medium":"https://dgalywyr863hv.cloudfront.net/pictures/athletes/1075670/948003/4/medium.jpg","profile":"https://dgalywyr863hv.cloudfront.net/pictures/athletes/1075670/948003/4/large.jpg","friend":null,"follower":null}}"

      //JWS token time
      let payload = {
        refreshToken: bodyArray[1],
        accessToken: bodyArray[2],
        althleteID: bodyArray[3]
      };

      let jwt = jwtoken.sign(payload, secretSuperKey, { expiresIn: "6h" });
      res.cookie("stravajwt", jwt, { httpOnly: true });
      return next();
    }
  );
}

function loadStravaProfile(req, res, next) {
  // console.log("Starting Strava Profile");
  let hubCookie = req.cookies.stravajwt;

  jwtoken.verify(hubCookie, secretSuperKey, (err, payload) => {
    if (err) {
      console.log(`Token Invalid: ${err}`);
      res.locals.err = "Strava token invalid";
    } else {
      console.log(
        `Session Valid - allow to proceed. User: ${payload.althleteID}`
      );
      res.locals.accessToken = payload.accessToken;
      res.locals.refreshToken = payload.refreshToken;
      res.locals.althleteID = payload.althleteID;
      request.get(
        {
          url: "https://www.strava.com/api/v3/athlete",
          headers: {
            Authorization: `Bearer ${res.locals.accessToken}`
          }
        },
        function(err, httpResponse, body) {
          if (err) {
            console.log(`Error with strava auth ${err}`);
            res.locals.err =
              "Error with strava - try again or logging with username/password";
            return next();
          }
          console.log(`Status:${httpResponse.statusCode}`);
          if (httpResponse.statusCode === 401) {
            // access token expired - refresh it
            res.clearCookie("stravajwt");
            next();
            return;
            request.post(
              {
                // TODO - refresh access token behind the scenes
                url: "https://www.strava.com/oauth/token",
                body: {
                  client_id: config.client_id,
                  client_secret: config.client_secret,
                  grant_type: "refresh_token",
                  refresh_token: res.locals.refreshToken
                }
              },
              function(err, httpResponse, body) {
                if (err) {
                  console.log(`Error with strava auth ${err}`);
                  res.locals.err =
                    "Error with strava - try again or logging with username/password";
                  return next();
                }
                console.log();
              }
            );
          } else {
            console.log(`strava Profile Aquired !!`);
            let stravaData = JSON.parse(body);
            res.locals.user = {
              avatar: stravaData.profile,
              firstname: stravaData.firstname,
              lastname: stravaData.lastname
            };
            fs.appendFileSync(
              "logs/users.txt",
              `${stravaData.firstname} ${stravaData.lastname}\n`
            );

            return next();
          }
        }
      );
    }
  });
}

function clearCookie(req,res,next){
  res.clearCookie("stravajwt");
  next();
}

//activity not in db already - create new activity and insert
function putActivityinDB(activity) {
  const newAct = new Activity(activity);
  let reterr = null;
  try {
    //try catch because my duplication errors are annoying
    newAct.save(err => {
      if (err) {
        console.log("Error Creating Activity:", err);
        let errMsg;
        switch (err.code) {
          case 11000:
            // do nothing, expecting lots of dupications
            // errMsg = "None unique Activity taken, please pick something else";
            err = null;
            break;

          default:
            errMsg = "Error creating Activity, try again later";
            break;
        }
        err = errMsg;
      }
    });
  } catch (error) {
    console.log(`Caught a DB error: ${error}`);
  }
  // return reterr;
}

function fetchFromDB(after, before, accessToken) {
  return new Promise((resolve, reject) => {
    resolve([accessToken]); //ignore DB for now
    return;
    console.log("This Shouldn't happen&&&&&&&&&&&&&&&&&&&&&&&&&");
    Activity.find({ date: { $lte: before, $gte: after } }, (err, docs) => {
      console.log(`Searching DB`);
      if (err) {
        console.log(`Error with DB: ${err}`);
        resolve([], accessToken);
      } else {
        console.log(`Found docs from DB: ${docs.length}`);
        let newActivityArray = [];
        docs.forEach(activity => {
          const newActivity = {
            id: activity.id,
            name: activity.name,
            line: activity.line,
            date: activity.date,
            color: activity.color,
            selected: activity.selected
          };
          newActivityArray.push(newActivity);
        });

        //do we have all the dates in our DB already?
        resolve(newActivityArray, accessToken);
      }
    }); //dnif
  });
}

//expect the accessToken to be the last entry in the array
function pingStrava(activities) {
  const accessToken = activities.pop();
  console.log("Ping Strava with accessToken:", accessToken);
  return new Promise((resolve, reject) => {
    let stravaData = [];
    buildStravaData(before, after, 1, stravaData, accessToken, function(
      err,
      stravaData
    ) {
      if (err) {
        console.log(`Error with strava ${err}`);
        resolve([]);
      } else {
        resolve(stravaData);
      }
    });
  });
}

// prettier-ignore
function buildStravaData(  before,  after,  page,  stravaData,  accessToken,  callback) {
  let stravaQuery = `https://www.strava.com/api/v3/athlete/activities?&after=${after}&before=${before}&page=${page}&per_page=200`;
  console.log(stravaQuery);
  console.log(
    `========================CALLING STRAVA API==============================`
  );
  request.get(
    {
      url: stravaQuery,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    },
    function(err, httpResponse, body) {
      if (err) {
        callback(err);
      }
      console.log(`Strava Data Aquired!!`);
      // console.log(body);
      let newData = JSON.parse(body);
      let newLength = newData.length;
      console.log(`Got ${newLength} new results`);
      stravaData = stravaData.concat(newData);

      if (newLength !== 200) {
        console.log(`less than 200 results`);
        callback(null,stravaData) ;
      } else {
        console.log('More than 200, getting more');
        // prettier-ignore
        buildStravaData(before,after,page + 1,stravaData,accessToken,callback);      }
    }
  );
}

function cleanUpStravaData(stravaData, activityType) {
  console.log(`cleaning up ${stravaData.length} entries`);
  let activities = [];
  stravaData.forEach(element => {
    //see config/dataNotes.js for element data types
    const newActivity = {};
    newActivity.id = element.id;
    newActivity.name = element.name;
    newActivity.line = element.map.summary_polyline;
    newActivity.date = makeEpochSecondsTime(element.start_date_local);
    newActivity.selected = false;
    newActivity.weight = 2;
    newActivity.color = "blue";
    newActivity.startLatLng = element.start_latlng;

    if (newActivity.line) {
      //only grab activities with a polyline
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

function makeEpochSecondsTime(string) {
  const date = new Date(string);
  const number = Math.floor(date.getTime() / 1000);
  return number;
}

//fetch activities in the date range between before and after
// activities stored in res.locals.activities in polyline format
// need to turn into points to be placed on map
// done by getPointsFromActivites
function getActivities(req, res, next) {
  after = req.query.after;
  before = req.query.before;
  activityType = req.query.type;
  console.log(`Type:${activityType}`);
  needToPingStrava = true;

  //swap if after is later than before
  // if (after > before) {
  //   [after, before] = [before, after];
  // }

  let activities = [];

  // check db for activties in this range
  fetchFromDB(after, before, res.locals.accessToken)
    .then(pingStrava)
    .then(result => {
      console.log(`Cleaning up from ping strava ${result.length}`);
      result = cleanUpStravaData(result, activityType);
      result = result.concat(activities);
      console.log(`Resolving DB promise result Length: ${result.length}`);

      res.locals.activities = result;
      console.log(`Got results from DB / Strava: Length: ${result == null}`);
      return next();
    })
    .catch(errorDispatch);
}

function getDemoData(req, res, next) {
  console.log("Getting Demo Data");
  const demoData = fs.readFileSync(__dirname + `/../../config/demoData.json`);
  let stravaData = JSON.parse(demoData);
  console.log(`Cleaning up from demoData`);
  res.locals.activities = cleanUpStravaData(stravaData);
  return next();
}

function errorDispatch(error) {
  console.log(`ERROR Will Robinson! ASYNC ERROR`);
  console.log(error);
}

//take polyline and decode into GPS points to be placed on map in polyline component
// ya I know its weird but here we are
function getPointsFromActivities(req, res, next) {
  let activities = res.locals.activities;

  // let pointsArray = []
  activities.forEach(activity => {
    try {
      const decodedPath = decodePolyline(activity.line);
      // pointsArray.push(decodedPath);
      activity.points = decodedPath;
    } catch (error) {
      console.log(`Error decoding activity: ${activity.name}`);
    }
  });

  // activities.push(pointsArray); //include points array as final item in array, must pop before processing names
  res.locals.activities = activities;
  return next();
}

module.exports = stravaController;
