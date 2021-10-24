const { fetchActivities, fetchDemo } = require("../services/summaryServices");

async function getSummaries(req, res, next) {
  console.log("Get Summaries");
  const after = parseInt(req.query.after);
  const before = parseInt(req.query.before);

  const activityType = req.query.type ? JSON.parse(req.query.type) : undefined;

  try {
    res.locals.activities = await fetchActivities(
      res,
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
