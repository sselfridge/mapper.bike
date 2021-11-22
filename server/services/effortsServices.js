const db = require("../models/db/dataLayer");
const dayjs = require("../utils/dayjs");

//models
const Activity = require("../models/Activity");
const User = require("../models/User");

//replaced by the sub model, but still useful for testing
async function updateAllUserSinceLast() {
  console.log("---------------------Doing Cron Stuff----------------");
  const users = await User.getAll();
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    // if (user.id === 1075670)
    await fetchNewUserActivities(user);
  }
  console.log("update finish");
  return "updateAllFinished";
}

async function fetchNewUserActivities(user) {
  const update = dayjs(user.lastUpdate);
  const after = update.unix();

  try {
    console.log("after: ", after);
    const activities = await User.fetchActivitiesAfter(user, after);
    console.log("adding to DB activities: ", activities.length);

    await Activity.batchAdd(activities, user.id);
  } catch (error) {
    console.error("Error Adding to activityQ");
    console.error(error.message);
    return;
  }
  console.log("Finished Adding to DB");
  user.lastUpdate = dayjs().format();
  try {
    await db.updateUser(user);
    console.log("User updated:", user);
  } catch (err) {
    console.error("Update user Error");
    console.error(err.message);
    return;
  }
}

module.exports = {
  updateAllUserSinceLast,
};
