const activities = require("./activities");
const users = require("./users");
const efforts = require("./segmentEfforts");
const details = require("./segmentDetails");
const utils = require("./utils");

const LIMIT_SIZE = 10;

const dataLayer = {
  addActivity,
  deleteActivity,
  deleteActivities,
  popActivities,

  getSegmentPath,
  getEfforts,
  getEffortsWithPath,
  storeSegments,

  popDetails,
  addDetails,

  addUser,
  updateUser,
  getUser,
  deleteUser,
};

async function addActivity(id, altheteId) {
  await activities.add(id, altheteId);
}

async function popActivities(limit = LIMIT_SIZE) {
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

async function popDetails(Limit = LIMIT_SIZE) {
  return await details.pop(Limit);
}

async function addDetails(data) {
  await details.update(data);
}

async function getEfforts(altheteId, rank = 10) {
  return await efforts.get(altheteId, rank);
}

async function getEffortsWithPath(altheteId, rank = 10) {
  const results = await efforts.get(altheteId, rank);
  for (const effort of results) {
    const effortDetail = await details.get(effort.segmentId);
    if (effortDetail.line) effort.line = effortDetail.line;
  }
  return results;
}

async function storeSegments(segments) {
  const rankedSegments = utils.parseRankedSegments(segments);
  const segmentDetails = utils.parseSegmentDetails(segments);
  await Promise.all([efforts.batchAdd(rankedSegments), details.batchAdd(segmentDetails)]);
}

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
