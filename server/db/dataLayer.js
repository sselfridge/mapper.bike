const activities = require("./activities");
const users = require("./users");
const efforts = require("./segmentEfforts");
const details = require("./segmentDetails");
const utils = require("./utils");

const LIMIT_SIZE = 10;

const dataLayer = {
  addActivity,
  deleteActivities,
  popActivities,

  getEfforts,
  getEffortsWithPath,
  storeSegments,

  popDetails,
  addDetails,
  batchDeleteAllDetails,

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

async function deleteActivities(ids) {
  await activities.batchDelete(ids);
}

async function popDetails(Limit = LIMIT_SIZE) {
  return await details.pop(Limit);
}

async function addDetails(data) {
  await details.update(data);
}

async function getEfforts(altheteId, rank = 10) {
  if (rank === "error") {
    return await efforts.getErrors(altheteId);
  } else {
    return await efforts.get(altheteId, rank);
  }
}

async function getEffortsWithPath(altheteId, rank = 10) {
  try {
    const results = await getEfforts(altheteId, rank);

    const promArray = results.map((effort) => details.get(effort.segmentId));
    const segmentDetails = await Promise.all(promArray);

    //TODO - this expects all the detail fetches to work, if this keeps erroring need to rework it.

    segmentDetails.forEach((detail, i) => {
      if (detail && results[i].segmentId === detail.id) {
        results[i].athleteCount = detail.athleteCount;
        results[i].distance = detail.distance;
        results[i].effortCount = detail.effortCount;
        results[i].elevation = detail.elevation;
        results[i].line = detail.line;
        results[i].updated = detail.updated;
      } else {
        console.error("Error Mapping segment details to effort", detail.id);
      }
    });
    return results;
  } catch (error) {
    console.log("Error:", error.message);
    console.log(error);
    return [];
  }
}

async function storeSegments(segments) {
  const rankedSegments = utils.parseRankedSegments(segments);
  const segmentDetails = utils.parseSegmentDetails(segments);

  await Promise.all([efforts.batchAdd(rankedSegments), details.batchAdd(segmentDetails)]);
}

async function addUser(data) {
  console.log("Data: Add User");
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

async function deleteUser(athleteId) {
  console.log("Deleting User ID", athleteId);

  //delete activities if any in progress
  const actvitiesQ = await activities.pop(5000);
  const actIds = actvitiesQ
    .filter((result) => result.athleteId === athleteId)
    .map((result) => result.id);
  console.log(`Deleting ${actIds.length} activities`);
  await batchDelete(activities, actIds);

  //delete efforts
  const results = await efforts.get(athleteId, 10);
  console.log(`Got ${results.length} to delete`);
  const ids = results.map((result) => result.id);

  console.log(`Deleting ${ids.length} efforts`);
  await batchDeleteEfforts(ids);
  await users.remove(athleteId);
}

async function batchDeleteEfforts(ids) {
  const promArr = [];
  while (ids.length > 0) {
    const batch = ids.slice(0, 20);

    promArr.push(efforts.batchDelete(batch));

    ids.splice(0, 20);
  }
  await Promise.all(promArr);
}

async function batchDeleteAllDetails() {
  const results = await details.getAll();
  console.log("batchDeleteAllDetails");
  const ids = results.map((result) => result.id);

  await batchDelete(details, ids);
}

async function batchDelete(table, ids) {
  while (ids.length > 0) {
    const batch = ids.slice(0, 20);
    await table.batchDelete(batch);
    ids.splice(0, 20);
    console.log("Batch Delete. Remaining:", ids.length);
  }
}

module.exports = dataLayer;
