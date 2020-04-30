const activities = require("./activities");
const users = require("./users");
const segments = require("./segments");
const utils = require("./utils");

const dataLayer = {
  addActivity,
  deleteActivity,

  getSegmentPath,
  addSegmentRank,
  getRankedSegments,

  addUser,
  updateUser,
  getUser,
  deleteUser,
};



async function addActivity(id, altheteId) {
  await activities.add(id, altheteId);
}

async function getActivties(limit = 10) {}

async function deleteActivity(id) {}

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

async function getActivity() {}
async function getEmptySegment() {}

async function addUser(data) {
  console.log('Data: Add USer');
  const id = data.id;
  const userExists = await users.exists(id);
  console.log('User Exists:', userExists);
  if (userExists) {
    throw new Error("User Already in DB");
  } else {
    console.log('Update user:',data);
    await users.update(data);
    console.log('User Updated');
  }
}

async function updateUser(id) {}

async function getUser(id) {
  const user = await users.get(id);
  return user;
}

async function deleteUser(id) {}

module.exports = dataLayer;
