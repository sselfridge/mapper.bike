const decodePolyline = require("decode-google-map-polyline");
const { makeEpochSecondsTime } = require("./utilityServices");

// Utility Functions
// Not middleware for requests, but more complex than basic utility

async function fetchActivitiesFromStrava(strava, after, before) {
  console.log("Fetching with:");
  // after = 1571036400;
  // before = 1590505696;
  console.log("after : ", after);
  console.log("before: ", before);

  const params = { after, before, page: 1, per_page: 200 };
  const r = { strava, activities: [] };
  const activities = await fetchActivitiesRecursively(params, r);
  return activities;
}

async function fetchActivitiesRecursively(params, r) {
  const page = params.page;
  console.log(`Recursive Call:${params.page}`);
  const resultActivities = await r.strava.athlete.listActivities(params);
  console.log(`Adding ${resultActivities.length} new activities`);
  r.activities = r.activities.concat(resultActivities);
  if (resultActivities.length < 200) {
    console.log("Recursive Call End", page);
  } else {
    console.log("We have go to deeper", page);
    params.page++;
    await fetchActivitiesRecursively(params, r);
  }

  console.log("End of this Func", page);
  console.log(r.activities.length);
  return r.activities;
}

function mapAndFilterStravaData(stravaData, activityType) {
  console.log(`cleaning up ${stravaData.length} entries`);
  let activities = [];
  // console.log(stravaData[0]); //uncomment to view stravaData format
  stravaData.forEach((element) => {
    //see config/dataNotes.js for element data types
    const newActivity = {};
    newActivity.id = element.id;
    newActivity.name = element.name;
    newActivity.line = element.map.summary_polyline;
    newActivity.date = makeEpochSecondsTime(element.start_date);
    newActivity.distance = element.distance;
    newActivity.elapsedTime = element.elapsed_time;

    //only grab activities with a polyline AKA non-trainer rides
    if (newActivity.line) {
      if (
        activityType === undefined ||
        activityType[element.type] === true ||
        (activityType.Other && activityType[element.type] === undefined)
      ) {
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
  });

  return activities;
};

module.exports = {
  fetchActivitiesFromStrava,
  decodePoly,
  mapAndFilterStravaData,
};
