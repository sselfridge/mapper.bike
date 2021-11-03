const fs = require("fs");
// const m = require("moment");
const dayjs = require("../utils/dayjs");

const decodePolyline = require("decode-google-map-polyline");
const { makeEpochSecondsTime } = require("./utilityServices");

// Utility Functions
// Not middleware for requests, but more complex than basic utility

async function fetchActivities(strava, after, before, activityType) {
  const result = await fetchActivitiesFromStrava(strava, after, before);

  const activities = mapAndFilterStravaData(result, activityType);

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
  const afterFriendly = dayjs(after * 1000).format("MMM DD YY");
  const beforeFriendly = dayjs(before * 1000).format("MMM DD YY");
  console.log(
    `Fetching between: '${afterFriendly}' and '${beforeFriendly}' (${after} -- ${before})`
  );

  const params = { after, before, page: 1, per_page: 200 };
  const r = { strava, activities: [] };
  const activities = await fetchConcurrently(params, r);
  return activities;
}

//Not longer need to go deeper
// async function fetchActivitiesRecursively(params, r) {
//   const page = params.page;
//   console.log(`Recursive Call:${params.page}`);
//   const resultActivities = await r.strava.athlete.listActivities(params);
//   console.log(`Adding ${resultActivities.length} new activities`);
//   r.activities = r.activities.concat(resultActivities);
//   if (resultActivities.length < 200) {
//     console.log("Recursive Call End", page);
//   } else {
//     console.log("We have go to deeper", page);
//     params.page++;
//     await fetchActivitiesRecursively(params, r);
//   }

//   console.log("End of this Func for page ", page);
//   console.log(r.activities.length);
//   return r.activities;
// }

async function fetchConcurrently(params, r) {
  const { after, before } = params;
  const day = 60 * 60 * 24;
  const days = Math.floor(((before - after) / day) * 0.75);
  const pageCount = Math.ceil(days / 200);

  //create array of pages. pageCount:3 => [1,2,3]
  const pagesArr = Array.from({ length: pageCount }, (v, i) => i + 1);

  const results = await Promise.all(
    pagesArr.map((v, i) =>
      r.strava.athlete.listActivities({ ...params, page: i + 1 })
    )
  );

  //Make sure we didn't miss anything
  const lastResult = results[results.length - 1];
  if (lastResult.length === 200) {
    let extraCount = 1;
    let result = [];
    do {
      console.log("Page guess too low, fetching extra page:", extraCount);
      result = await r.strava.athlete.listActivities({
        ...params,
        page: pageCount + extraCount,
      });
      results.push(result);
      extraCount++;
    } while (result.length === 200);
  }

  return results.flat(1);
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
