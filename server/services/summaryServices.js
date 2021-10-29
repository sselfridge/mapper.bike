const fs = require("fs");

const decodePolyline = require("decode-google-map-polyline");
const { makeEpochSecondsTime } = require("./utilityServices");

// Utility Functions
// Not middleware for requests, but more complex than basic utility

async function fetchActivities(strava, after, before, activityType) {
  const result = await fetchActivitiesFromStrava(strava, after, before);

  const activities = mapAndFilterStravaData(result);

  return activities;
}
async function fetchDemo() {
  const demoData = fs.readFileSync(__dirname + `/../../config/demoData.json`);
  let stravaData = JSON.parse(demoData);
  console.log(`Cleaning up from demoData`);
  const demoActivities = mapAndFilterStravaData(stravaData);

  return demoActivities;
}

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

  console.log("End of this Func for page ", page);
  console.log(r.activities.length);
  return r.activities;
}

function mapAndFilterStravaData(stravaData, activityType) {
  console.log(`cleaning up ${stravaData.length} entries`);
  const activities = stravaData
    .filter((activity) => {
      if (activity.map.summary_polyline) {
        if (
          activityType === undefined ||
          activityType[activity.type] === true ||
          (activityType.Other && activityType[activity.type] === undefined)
        ) {
          return true;
        }
      }

      return false;
    })
    .map((activity) => {
      let points;
      try {
        const decodedPath = decodePolyline(activity.map.summary_polyline);
        points = decodedPath;
      } catch (error) {
        console.log(`Error decoding activity: ${activity.name}`);
        console.log(error);
      }

      return {
        id: activity.id,
        name: activity.name,
        line: activity.map.summary_polyline,
        date: makeEpochSecondsTime(activity.start_date),
        distance: activity.distance,
        elapsedTime: activity.elapsed_time,
        type: activity.type,
        athleteId: activity.athlete.id,
        points,
      };
    });

  return activities;
}

module.exports = {
  fetchActivities,
  fetchDemo,
};
