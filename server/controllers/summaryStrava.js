const fs = require("fs");

const {
  fetchActivitiesFromStrava,
  decodePoly,
  mapAndFilterStravaData,
} = require("../services/summaryServices");

// fetch activities in the date range between before and after
// activities stored in res.locals.activities in polyline format
// need to turn into points to be placed on map
// done by getPointsFromActivities
async function getSummaries(req, res, next) {
  console.log("Get Summaries");
  const after = parseInt(req.query.after);
  const before = parseInt(req.query.before);

  const activityType = req.query.type ? JSON.parse(req.query.type) : undefined;

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

function errorDispatch(err, req, res, next) {
  console.log(`ERROR Will Robinson! ASYNC ERROR`);
  console.log(err);
  res.locals.err = "err";
  next();
}

module.exports = {
  getSummaries,
  getDemoData,
};
