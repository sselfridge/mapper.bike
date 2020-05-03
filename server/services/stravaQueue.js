const config = require("../../config/keys");
const db = require("../db/dataLayer");

var stravaAPI = require("strava-v3");
stravaAPI.config({
  client_id: config.client_id,
  client_secret: config.client_secret,
  redirect_uri: config.redirect_uri,
});

const stravaQueue = {
  processQueue,
};

async function processQueue() {
  console.log("Process Queue");
  //check strava rate
  //if less than .75 proceed
  let stravaRate = stravaAPI.rateLimiting.fractionReached();
  while (stravaRate < 0.75) {
    console.log("Strava Rate:==========================", stravaRate);

    try {
      await getActivityDetails();
      await processPathlessSegments();
    } catch (error) {
      console.log("Queue Error:", error.message);
      console.log(error.errors);
    }
    stravaRate = stravaAPI.rateLimiting.fractionReached();

  } 

  console.log("Process Done");
  console.log("Strava Useage at:",stravaRate);
  console.log(stravaAPI.rateLimiting);
}

async function getActivityDetails() {
  console.log("Get Activity Details");
  const memo = {};
  const completedActivities = [];
  const activities = await db.popActivities();
  console.log(`Geting details for ${activities.length} activities`);
  if(activities.length === 0) return 

  for (const activity of activities) {
    const athleteId = activity.athleteId;
    const strava = await getClient(athleteId, memo);

    const fullActivity = await strava.activities.get({
      id: activity.id,
      include_all_efforts: true,
    });
    const result = await parseActivity(fullActivity);
    if (result) completedActivities.push(activity.id);
  }

  await db.deleteActivities(completedActivities);
}

async function parseActivity(activity) {
  const rankedSegments = parseRankedSegments(activity);
  try {
    await db.storeSegments(rankedSegments);
  } catch (error) {
    console.log("Store Segment Error", error.message);
    return false;
  }
  return true;
}

async function getClient(athleteId, memo) {
  if (memo[athleteId]) return memo[athleteId];

  const user = await db.getUser(athleteId);
  const strava = new stravaAPI.client(user.accessToken);
  memo[athleteId] = strava;
  return strava;
}

const parseRankedSegments = (activity) => {
  const rankedSegments = [];
  if (!activity.segment_efforts) {
    console.log("No Segment efforts on Activity");
    return [];
  }

  activity.segment_efforts.forEach((effort, index) => {
    if (effort.kom_rank !== null) {
      console.log(effort.kom_rank);
      rankedSegments.push(effort);
    }
  });
  console.log(`Found ${rankedSegments.length} segments to save`);
  return rankedSegments;
};

async function processPathlessSegments() {
  console.log('Get pathless Segments');
  const memo = {};
  const strava = await getClient(1075670, memo);

  console.log('popDetails');
  const segments = await db.popDetails();
  const ids = segments.map((segment) => segment.id);

  if(ids.length === 0) return;

  console.log('Parse segment Ids',ids);
  for (const id of ids) {
    let data = await getSegmentDetails(strava, id);
    if(!data){
      data = {id, line: "error"}
    }
    await db.addDetails(data);
    console.log("DB Detail added");
  }
}

async function getSegmentDetails(strava, id) {
  console.log('getting detail for id:',id);
  try {
    const result = await strava.segments.get({ id });
    return {
      id: result.id,
      line: result.map.polyline,
    };
  } catch (error) {
      console.log("Error:::::",error.message);
  }
}

module.exports = stravaQueue;
