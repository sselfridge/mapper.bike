const { fetchActivities, fetchDemo } = require("../services/summaryServices");

async function getSummaries(req, res, next) {
  console.log("Get Summaries");
  const after = parseInt(req.query.after, 10);
  const before = parseInt(req.query.before, 10);

  const activityType = req.query.type ? JSON.parse(req.query.type) : undefined;

  const strava = res.locals.strava;

  try {
    res.locals.activities = await fetchActivities(
      strava,
      after,
      before,
      activityType
    );
    next();
  } catch (err) {
    res.locals.activities = [];
    errorDispatch(err, req, res, next);
  }
}

//recreate demo data from base activities
function getDemoData(req, res, next) {
  res.locals.activities = fetchDemo();

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
