const fs = require("fs");
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
// eslint-disable-next-line require-await
async function fetchDemo() {
  const demoData = fs.readFileSync(__dirname + `/../../config/demoData.json`);
  let stravaData = JSON.parse(demoData);
  console.log(`Cleaning up from demoData`);
  const demoActivities = mapAndFilterStravaData(stravaData);

  return demoActivities;
}

async function fetchActivitiesFromStrava(strava, after, before) {
  const afterDate = dayjs.unix(after);
  const beforeDate = dayjs.unix(before);

  const afterFriendlyUnix = afterDate.format("MMM DD YY");
  const beforeFriendlyUnix = beforeDate.format("MMM DD YY");
  console.log(
    `Fetching between: '${afterFriendlyUnix}' and '${beforeFriendlyUnix}' (${after} -- ${before})`
  );

  //Strava's date range is a bit off, so adding a full day of padding then filtering the results

  const params = { after, before: before + 86400, page: 1, per_page: 200 };
  const r = { strava, activities: [] };
  const activities = await fetchConcurrently(params, r);

  const filteredActivities = activities.filter((act) => {
    const startDate = dayjs(act.start_date);
    return startDate.isBefore(beforeDate) && startDate.isAfter(afterDate);
  });

  return filteredActivities;
}

async function fetchConcurrently(params, r) {
  const { after, before } = params;

  const pageCount = estimatePageCount(after, before);

  //create array of pages. pageCount:3 => [1,2,3]
  const pagesArr = Array.from({ length: pageCount }, (v, i) => i + 1);

  const results = await Promise.all(
    pagesArr.map((v, i) =>
      r.strava.athlete.listActivities({ ...params, page: i + 1 })
    )
  );

  if (results.length === 0) return [];

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

const estimatePageCount = (after, before) => {
  const day = 60 * 60 * 24;
  const days = Math.floor(((before - after) / day) * 0.75);
  const pageCount = Math.min(15, Math.ceil(days / 200));
  // 15 pages covers 3000 activities
  return pageCount;
};

module.exports = {
  fetchActivities,
  fetchDemo,
};
