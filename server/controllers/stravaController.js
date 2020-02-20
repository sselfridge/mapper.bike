const jwtoken = require("jsonwebtoken");
const Cryptr = require("cryptr");
const request = require("request");
const decodePolyline = require("decode-google-map-polyline");
const fs = require("fs");

// DB requirments, not being used but keeping around for the future
// const Activity = require("./../models/activityModel");
// const mongoose = require("mongoose");

const config = require("../../config/keys");
const cryptr = new Cryptr(config.secretSuperKey);

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
      tokenRegex = /expires_at":(\d+).*refresh_token":"([^"]+).*access_token":"([^"]+).*"athlete":{"id":(\d+)/;
      bodyArray = tokenRegex.exec(body);
      // console.log(`body`);
      // console.log(body);
      // console.log(`Refresh Token: ${bodyArray[1]}`);
      // console.log(`accessToken: ${bodyArray[2]}`);
      // console.log(`Athlete Number: ${bodyArray[3]}`);

      // SAMPLE RESPONSE as of 10/23/2019
      // {"token_type":"Bearer","expires_at":1571883514,"expires_in":20504,"refresh_token":"a4d6b48cc0d5502d17ba59e6d87f8ae3b173a813",
      // "access_token":"e4f2b085afaeee810085b683d085334f5e7887e8",
      // "athlete":{ "id":1075670,"username":"sirclesam","resource_state":2,"firstname":"Sam ","lastname":"Wise | LG",
      //             "city":"Los Angeles","state":"California","country":"United States","sex":"M","premium":true,"summit":true,
      //             "created_at":"2012-09-06T17:53:52Z","updated_at":"2019-10-12T17:01:50Z","badge_type_id":1,
      //             "profile_medium":"https://dgalywyr863hv.cloudfront.net/pictures/athletes/1075670/948003/4/medium.jpg",
      //             "profile":"https://dgalywyr863hv.cloudfront.net/pictures/athletes/1075670/948003/4/large.jpg","friend":null,"follower":null}}

      let payload = {
        expires_at: bodyArray[1],
        refreshToken: bodyArray[2],
        accessToken: bodyArray[3],
        athleteID: bodyArray[4]
      };

      setJWTCookie(res, payload);

      return next();
    }
  );
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

//check if the accesstoken is expired, if so request a new one
function checkAndRefreshStravaToken(res) {
  return new Promise((resolve, reject) => {
    const now = Date.now() / 1000;
    const expiredDiff = res.locals.expires_at - now;
    console.log("Token Expires in (minutes):", expiredDiff / 60);
    console.log("Refresh Token", res.locals.refreshToken);
    if (expiredDiff <= 0) {
      console.log("Token Expired, refreshing");
      request.post(
        {
          url: "https://www.strava.com/api/v3/oauth/token",
          form: {
            client_id: config.client_id,
            client_secret: config.client_secret,
            grant_type: "refresh_token",
            refresh_token: res.locals.refreshToken
          }
        },
        function(err, httpResponse, body) {
          if (err) {
            console.log(`Error with strava api ${err}`);
            res.locals.err = "Error with strava - try again or logging with username/password";
            return reject(err);
          }
          if (httpResponse.statusCode != 200) {
            console.log("Non 200 response for token refresh");
            console.log(body);
            return reject(
              `200 status expected. Refresh request res code:${httpResponse.statusCode}`
            );
          }
          tokenRegex = /.*access_token":"([^"]+).*expires_at":(\d+).*refresh_token":"([^"]+)/;
          bodyArray = tokenRegex.exec(body);
          console.log("body: ", body);
          // body:  {"token_type":"Bearer","access_token":"e4f2b085afaeee810085b683d085334f5e7887e8",
          // "expires_at":1571883514,"expires_in":17153,"refresh_token":"a4d6b48cc0d5502d17ba59e6d87f8ae3b173a813"}
          accessToken = bodyArray[1];
          res.locals.accessToken = accessToken;

          expires_at = bodyArray[2];
          res.locals.expires_at = expires_at;

          refreshToken = bodyArray[3];
          res.locals.refreshToken = refreshToken;

          let payload = {
            expires_at: res.locals.expires_at,
            refreshToken: res.locals.refreshToken,
            accessToken: res.locals.accessToken,
            athleteID: res.locals.athleteID
          };
          setJWTCookie(res, payload);

          return resolve();
        }
      );
    } else {
      //token not expired proceed as usual
      return resolve();
    }
  });
}

function loadStravaProfile(req, res, next) {
  console.log("loadStravaProfile");
  const jwt = req.cookies.stravajwt;
  let hubCookie;
  try {
    //this fails badly if the key is wrong
    hubCookie = cryptr.decrypt(jwt);    
  } catch (error) {
    hubCookie = 'This Will Fail'
  }
  jwtoken.verify(hubCookie, config.secretSuperKey, (err, payload) => {
    if (err) {
      console.log(`Token Invalid: ${err}`);
      res.locals.err = "JWT / Cookie token invalid";
    } else {
      console.log(`JWT Valid - allow to proceed. athleteID: ${payload.athleteID}`);
      res.locals.expires_at = payload.expires_at;
      res.locals.accessToken = payload.accessToken;
      res.locals.refreshToken = payload.refreshToken;
      res.locals.athleteID = payload.athleteID;
      console.log("Access Token: ", res.locals.accessToken);
      checkAndRefreshStravaToken(res)
        .then(() => {
          request.get(
            {
              url: "https://www.strava.com/api/v3/athlete",
              headers: {
                Authorization: `Bearer ${res.locals.accessToken}`
              }
            },
            function(err, httpResponse, body) {
              if (err) {
                console.log(`Error with strava auth request: ${err}`);
                res.locals.err = "Error with strava - try again or use another username/password";
                return next();
              }
              if (httpResponse.statusCode === 401) {
                // access token expired - clear it so it can be refreshed
                res.clearCookie("stravajwt", { httpOnly: true });
                next();
                return;
              } else {
                console.log(`strava token valid !!`);
                let stravaData = JSON.parse(body);
                res.locals.user = {
                  avatar: stravaData.profile,
                  firstname: stravaData.firstname,
                  lastname: stravaData.lastname
                };
                fs.appendFileSync(
                  "logs/users.txt",
                  formatUserNameLog(stravaData.firstname, stravaData.lastname)
                );

                return next();
              }
            }
          );
        })
        .catch(err => {
          console.log("Bad thing happen while trying to refresh Token", err);
        });
    }
  });
}

//make names the same length and add a date stamp
function formatUserNameLog(firstname, lastname) {
  let str = firstname + " " + lastname;
  if (str.length > 30) {
    str = str.substring(0, 30);
  } else {
    while (str.length < 30) str = str + " ";
  }
  let date = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
  return str + date + "-PST \n";
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
      accessToken: accessToken
    };

    //build callback for recusrive strava calls
    const callback = function(err, resultStravaArray) {
      if (err) {
        console.log(`Error with strava ${err}`);
        return resolve([]);
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
  // console.log(stravaData[0]); //uncomment to view stravaData format
  stravaData.forEach(element => {
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
