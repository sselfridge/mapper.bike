const summaryStrava = require("./summaryStrava");
const db = require("../db/dataLayer");
const config = require("../../config/keys");
const utils = require("../utils/stravaUtils");

const segmentController = {
  test,
  segments,
  intializeUser,
  updateUserDB,
};

async function updateUserDB(req, res, next) {
  console.log("updating user in DB");
  const userData = makeUserData(res);
  try {
    await db.updateUser(userData);
  } catch (err) {
    res.locals.err = err;
    next();
  }
  next();
}

async function intializeUser(req, res, next) {
  try {
    const strava = res.locals.strava;
    const userData = makeUserData(res);
    await db.updateUser(userData); //TODO switch this to add user

    //kick_off get activities
    addToActivityQueue(strava);
    //get stats
    const count = totalUserActivites(strava, res.user.althleteId);

    res.locals.data = { activityCount: count };
    next();
  } catch (err) {
    res.locals.err = err;
    next();
  }
}

function makeUserData(res) {
  const user = res.locals.user;
  const accessToken = res.locals.accessToken;
  const refreshToken = res.locals.refreshToken;
  const userData = {
    id: user.althleteId,
    accessToken,
    refreshToken,
  };
  return userData;
}

async function checkInitStatus(req, res, next) {
  //get user stats
  //get # of user actvities in Queue
}

async function checkSegmentSyncStatus(req, res, next) {}

async function segments(req, res, next) {
  res.send("ok");
}

async function totalUserActivites(strava, id) {
  const result = await strava.athletes.stats({ id });
  const count = result.all_ride_totals.count + result.all_run_totals.count;
  return count;
}

async function addToActivityQueue(strava) {
  try {
    //2534960296 is 2050
    // const result = await summaryStrava.fetchActivitiesFromStrava(strava, 0, 2534960296);
    //March + April Rides
    const result = await summaryStrava.fetchActivitiesFromStrava(strava, 1585724400, 1588220022);
    // 1 result
    // const result = await summaryStrava.fetchActivitiesFromStrava(strava, 1588057200, 1588220022);
    console.log(`Adding ${result.length} activites to DB`);
    result.forEach((activity) => {
      if (!activity.map.summary_polyline) return; //skip activites with no line
      db.addActivity(activity.id, activity.athlete.id);
    });
    console.log("Done Adding to DB");
  } catch (error) {
    console.error("Error while Adding to activtity table:", error.message);
    //Do nothing for now, add event emitter here if this starts to become a problem
  }
}

async function test(req, res, next) {
  console.log("Start Test");
  const strava = res.locals.strava;

  // const result = await strava.segments.listEfforts({ id: 23295888, page_size: 200 });
  // const result = await strava.segments.listStarred({});
  // const result = await strava.segments.listLeaderboard({ id: 23295888, page_size: 200 });

  try {
    // const stravaQ = require('../services/stravaQueue')

    // stravaQ.processQueue();

    const segmentDetails = require("../db/segmentDetails");
    // const details = [{ id: 12345 }, { id: 987654321 }];
    const details = [{ id: 12345 }, { id: 987654321 }, { id: 76534, line: 'aerqew LINE'}];

    const result = await segmentDetails.batchUpdate(details);

    console.log("Result");
    console.log(result);
  } catch (err) {
    console.log("CRAP!!!");
    console.log(err.message);
    res.locals.err = "AAAAAAAAA";
  }

  console.log("Test Done");
  next();
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

module.exports = segmentController;
