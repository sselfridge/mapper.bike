const activities = require("./activities");
const users = require("./users");
const segments = require("./segments");
const utils = require("./utils");

const dataLayer = {
  getSegmentPath,
  addActivity,
  deleteActivity,
  addSegmentRank,
  getRankedSegments,
  userInDB,
  updateUser,
  deleteUser,
};

//stop calling if hit rate limit
async function getSegmentPath(id) {
  //check for path in DB
  //if strava queue < .50 - throw error otherwise
  //get segment path from strava
  // save to db
  //
  //return path
}

async function addActivity(id,altheteId) {
  activities.add
}
async function deleteActivity(id) {}
async function addSegmentRank(data) {}
async function getRankedSegments(altheteId) {}
async function getSegmentDetails(id) {}

async function getActivity() {}
async function getEmptySegment() {}

async function userInDB(id) {}
async function updateUser(id) {}
async function deleteUser(id) {}

module.exports = dataLayer;
