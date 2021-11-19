const Activity = require("../models/Activity");
const User = require("../models/User");
const Effort = require("../models/Effort");

function getUserData(res) {
  const user = res.locals.user;
  const accessToken = res.locals.accessToken;
  const refreshToken = res.locals.refreshToken;
  const userData = {
    id: user.athleteId,
    accessToken,
    refreshToken,
  };
  return userData;
}

async function totalUserActivities(strava, id) {
  const result = await strava.athletes.stats({ id }); //TODO use global strava client
  const count = result.all_ride_totals.count + result.all_run_totals.count;
  return count;
}

async function deleteUser(athleteId) {
  console.log("Deleting User ID", athleteId);

  //delete activities if any in progress
  const activitiesQ = await Activity.getAll();
  const actIds = activitiesQ
    .filter((result) => result.athleteId === athleteId)
    .map((result) => result.id);
  console.log(`Deleting ${actIds.length} activities from queue`);
  await Activity.delete(actIds);

  //delete efforts
  const results = await Effort.get(athleteId, 10);
  console.log(`Got ${results.length} to delete`);
  const ids = results.map((result) => result.id);

  console.log(`Deleting ${ids.length} efforts`);
  await Effort.delete(ids);
  await User.remove(athleteId);
}

module.exports = {
  getUserData,
  totalUserActivities,
  deleteUser,
};
