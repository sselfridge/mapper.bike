const db = require("./db/activity_aws");

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

  static deleteAll = async (data) => {
    const ids = await db.getAll();

    while (ids.length > 0) {
      const batch = ids.slice(0, 20);
      await db.batchDelete(batch);
      ids.splice(0, 20);
      console.log("Batch Delete. Remaining:", ids.length);
    }
  };

  static add = async (activities, athleteId) => {
    //TODO - test if this still hits the DB limit
    console.info("Adding activities to DB:", activities.length);
    console.time("Add Act");
    for (let i = 0; i < activities.length; i++) {
      const activity = activities[i];
      if (!activity.line) continue; //skip activities with no line
      await db.add(activity.id, athleteId);
      await this.sleep(50);
    }
    console.timeEnd("Add Act");
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
