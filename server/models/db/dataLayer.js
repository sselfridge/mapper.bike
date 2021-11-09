const Activity = require("./activity_aws");
const User = require("./user_aws");
const Effort = require("./effort_aws");
const Segment = require("./segment_aws");

const utils = require("./utils");

const LIMIT_SIZE = 10;

const dataLayer = {
  addActivity,
  deleteActivities,
  popActivities,
  deleteAllActivities,

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
  console.info("segments: ", segmentSummaries);
  const rankedSegments = utils.parseRankedSegments(segmentSummaries);

  const segments = segmentSummaries.map((segment) => ({
    id: segment.segment.id,
  }));

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
  const userExists = await User.exists(data.id);
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
  const activitiesQ = await Activity.getAll();
  const actIds = activitiesQ
    .filter((result) => result.athleteId === athleteId)
    .map((result) => result.id);
  console.log(`Deleting ${actIds.length} activities`);
  await deleteItems(Activity, actIds);

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

async function deleteAllActivities() {
  console.log("Deleting All Activities");
  await deleteAll("activities");
}
async function deleteAllSegments() {
  console.log("Deleting All Segments");
  await deleteAll("segments");
}
async function deleteAllEfforts() {
  console.log("Deleting All Efforts");
  await deleteAll("efforts");
}

async function deleteAll(tableName) {
  if (process.env.NODE_ENV === "production") {
    console.info("Cannot delete all in production mode");
    return;
  }
  const tables = {
    activities: Activity,
    segments: Segment,
    efforts: Effort,
  };
  const Table = tables[tableName];
  const results = await Table.getAll();
  const ids = results.map((result) => result.id);

  await deleteItems(Table, ids);
}

async function deleteItems(table, ids) {
  while (ids.length > 0) {
    const batch = ids.slice(0, 20);
    await table.batchDelete(batch);
    ids.splice(0, 20);
    console.log("Batch Delete. Remaining:", ids.length);
  }
}

module.exports = dataLayer;
