const Activity = require("./Activity");
const User = require("./User");
const Effort = require("./Effort");
const Segment = require("./Segment");

const utils = require("./utils");

const LIMIT_SIZE = 10;

const dataLayer = {
  addActivity,
  deleteActivities,
  popActivities,

  getEfforts,
  getEffortsWithPath,
  storeSegments,
  getEffort,
  deleteAllEfforts,

  popDetails,
  getAllPathlessSegments,
  updateSegment,
  deleteAllSegments,

  addUser,
  updateUser,
  getUser,
  getAllUsers,
  deleteUser,
};

async function addActivity(id, athleteId) {
  await Activity.add(id, athleteId);
}

async function popActivities(limit = LIMIT_SIZE) {
  return await Activity.pop(limit);
}

async function deleteActivities(ids) {
  await Activity.batchDelete(ids);
}

async function popDetails(Limit = LIMIT_SIZE) {
  return await Segment.pop(Limit);
}

async function getAllPathlessSegments() {
  return await Segment.getAllPathless();
}

async function updateSegment(data) {
  await Segment.update(data);
}

async function getEfforts(athleteId, rank = 10) {
  if (rank === "error") {
    return await Effort.getErrors(athleteId);
  } else {
    return await Effort.getByRank(athleteId, rank);
  }
}
async function getEffort(effortId) {
  return await Effort.get(effortId);
}

//NOTE - need to work out how this handles missing segments
// currently they just show up as undefined in the segmentDetails array
async function getEffortsWithPath(athleteId, rank = 10) {
  try {
    const results = await getEfforts(athleteId, rank);

    const promArray = results.map((effort) => Segment.get(effort.segmentId));
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
        console.error(
          "Error Mapping segment details to effort",
          detail && detail.id
        );
      }
    });
    return results;
  } catch (error) {
    console.log("Error:", error.message);
    console.log(error);
    return [];
  }
}

async function storeSegments(segmentSummaries) {
  console.info('segments: ', segmentSummaries);
  const rankedSegments = utils.parseRankedSegments(segmentSummaries);

  const segments = segmentSummaries.map(segment => ({id: segment.segment.id}))


  await Promise.all([
    Effort.batchAdd(rankedSegments),
    Segment.batchAdd(segments),
  ]);
}

async function addUser(data) {
  console.log("Data: Add User");
  const id = data.id;
  const userExists = await User.exists(id);
  console.log("User Exists:", userExists);
  if (userExists) {
    throw new Error("User Already in DB");
  } else {
    console.log("Add user:", data);
    await User.update(data);
  }
}

async function updateUser(data) {
  const id = data.id;
  const userExists = await User.exists(id);
  if (!userExists) throw new Error("Update Error: User not in DB");
  else {
    await User.update(data);
  }
}

async function getUser(id) {
  const user = await User.get(id);
  return user;
}

async function getAllUsers() {
  const allUsers = await User.getAll();
  return allUsers;
}

async function deleteUser(athleteId) {
  console.log("Deleting User ID", athleteId);

  //delete activities if any in progress
  const actvitiesQ = await Activity.pop(5000);
  const actIds = actvitiesQ
    .filter((result) => result.athleteId === athleteId)
    .map((result) => result.id);
  console.log(`Deleting ${actIds.length} activities`);
  await batchDelete(Activity, actIds);

  //delete efforts
  const results = await Effort.get(athleteId, 10);
  console.log(`Got ${results.length} to delete`);
  const ids = results.map((result) => result.id);

  console.log(`Deleting ${ids.length} efforts`);
  await batchDeleteEfforts(ids);
  await User.remove(athleteId);
}

async function batchDeleteEfforts(ids) {
  const promArr = [];
  while (ids.length > 0) {
    const batch = ids.slice(0, 20);

    promArr.push(Effort.batchDelete(batch));

    ids.splice(0, 20);
  }
  await Promise.all(promArr);
}

async function deleteAllSegments() {
  if(process.env.NODE_ENV === 'production') {
    console.info("Cannot delete all in production mode");
    return;
  }
  const results = await Segment.getAll();
  console.log("delete All Segments");
  const ids = results.map((result) => result.id);

  await batchDelete(Segment, ids);
}
async function deleteAllEfforts() {
  if(process.env.NODE_ENV === 'production') {
    console.info("Cannot delete all in production mode");
    return;
  }

  const results = await Effort.getAll();
  console.log("Delete All Efforts");
  const ids = results.map((result) => result.id);

  await batchDelete(Effort, ids);
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
