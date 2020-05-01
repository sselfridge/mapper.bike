const activities = require("./activities");
const users = require("./users");
const efforts = require("./segmentEfforts");
const details = require("./segmentDetails");
const utils = require("./utils");

const dataLayer = {
  addActivity,
  deleteActivity,
  deleteActivities,
  popActivities,

  getSegmentPath,
  addSegmentRank,
  getRankedSegments,
  storeSegments,

  addUser,
  updateUser,
  getUser,
  deleteUser,
};

async function addActivity(id, altheteId) {
  await activities.add(id, altheteId);
}

async function popActivities(limit = 1) {
  return await activities.pop(limit);
}

async function deleteActivity(id) {}

async function deleteActivities(ids) {
  await activities.batchDelete(ids);
}

//stop calling if hit rate limit
async function getSegmentPath(id) {
  //check for path in DB
  //if strava queue < .50 - throw error otherwise
  //get segment path from strava
  // save to db
  //
  //return path
}

async function addSegmentRank(data) {}
async function getRankedSegments(altheteId) {}
async function getSegmentDetails(id) {}

async function storeSegments(segments) {
  const rankedSegments = utils.parseRankedSegments(segments);
  const segmentDetails = utils.parseSegmentDetails(segments);

  await Promise.all([efforts.batchAdd(rankedSegments), details.batchAdd(segmentDetails)]);
}

async function getActivity() {}
async function getEmptySegment() {}

async function addUser(data) {
  console.log("Data: Add USer");
  const id = data.id;
  const userExists = await users.exists(id);
  console.log("User Exists:", userExists);
  if (userExists) {
    throw new Error("User Already in DB");
  } else {
    console.log("Add user:", data);
    await users.update(data);
  }
}

async function updateUser(data) {
  const id = data.id;
  const userExists = await users.exists(id);
  if (!userExists) throw new Error("Update Error: User not in DB");
  else {
    await users.update(data);
  }
}

async function getUser(id) {
  const user = await users.get(id);
  return user;
}

async function deleteUser(id) {}

module.exports = dataLayer;
