const jwtoken = require("jsonwebtoken");
const request = require("request");
const decodePolyline = require("decode-google-map-polyline");
const fs = require("fs");

// DB requirments, not being used but keeping around for the future
// const Activity = require("./../models/activityModel");
// const mongoose = require("mongoose");

const config = require("../../config/keys");

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
        res.locals.err = "Error with strava - try again or logging with username/password";
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

      let jwt = jwtoken.sign(payload, config.secretSuperKey, { expiresIn: "6h" });
      res.cookie("stravajwt", jwt, { httpOnly: true });
      return next();
    }
  );
}

function loadStravaProfile(req, res, next) {
  let hubCookie = req.cookies.stravajwt;

  jwtoken.verify(hubCookie, config.secretSuperKey, (err, payload) => {
    if (err) {
      console.log(`Token Invalid: ${err}`);
      res.locals.err = "Strava token invalid";
    } else {
      console.log(`Session Valid - allow to proceed. User: ${payload.althleteID}`);
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
            res.locals.err = "Error with strava - try again or logging with username/password";
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
            fs.appendFileSync("logs/users.txt", `${stravaData.firstname} ${stravaData.lastname}\n`);

            return next();
          }
        }
      );
    }
  });
}

function clearCookie(req, res, next) {
  res.clearCookie("stravajwt");
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
      accessToken: accessToken
    };
    const callback = function(err, resultStravaArray) {
      if (err) {
        console.log(`Error with strava ${err}`);
        resolve([]);
      } else {
        resolve(resultStravaArray);
      }
    };

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
      if (err) {
        callback(err);
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

  //swap if after is later than before
  // if (after > before) {
  //   [after, before] = [before, after];
  // }

  pingStrava(after, before, res.locals.accessToken)
    .then(result => {
      result = cleanUpStravaData(result, activityType);
      console.log(`Cleaned up result length: ${result.length}`);

      res.locals.activities = result;
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

// take polyline and decode into GPS points to be placed on map in polyline component
// ya I know its weird but here we are
function getPointsFromActivities(req, res, next) {
  let activities = res.locals.activities;

  // let pointsArray = []
  activities.forEach(activity => {
    try {
      const decodedPath = decodePolyline(activity.line);
      activity.points = decodedPath;
      //get mid point of activity for centering map
      //TODO: This would be better by getting the 4 extremes and using them
      const midPoint = decodedPath[Math.floor(decodedPath.length / 2)];
      activity.midLatLng = [midPoint.lat, midPoint.lng];
    } catch (error) {
      console.log(`Error decoding activity: ${activity.name}`);
    }
  });

  // activities.push(pointsArray); //include points array as final item in array, must pop before processing names
  res.locals.activities = activities;
  return next();
}

module.exports = stravaController;
