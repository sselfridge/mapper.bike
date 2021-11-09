const db = require("./db/activity_aws");

const User = require("./User");

class Activity {
  static add = async (id, athleteId) => {
    await db.add(id, athleteId);
  };

  static delete = async (ids) => {
    if (ids.length > 25)
      throw new Error(
        "Max of 25 activities may be deleted at one time,received:",
        ids.length
      );
    await db.batchDelete(ids);
  };

  static pop = async (limit) => {
    return await db.pop(limit);
  };

  static deleteAllActivities = async (data) => {
    const ids = db.getAll();

    while (ids.length > 0) {
      const batch = ids.slice(0, 20);
      await db.batchDelete(batch);
      ids.splice(0, 20);
      console.log("Batch Delete. Remaining:", ids.length);
    }
  };

  static addToActivityQueue = async (user, after = 0) => {
    console.log("User: ", User);
    console.log("User: ", Object.keys(User));

    // const activities = await User.fetchActivitiesAfter(user, after);
    const activities = [];
    //TODO - test if this still hits the DB limit
    await activities.forEach(async (activity) => {
      if (!activity.line) return; //skip activities with no line
      await db.addActivity(activity.id, activity.athleteId);
      await this.sleep(100);
    });
    console.log("Done Adding to DB");
  };

  static sleep = (delay) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, delay);
    });
  };
}
module.exports = Activity;
