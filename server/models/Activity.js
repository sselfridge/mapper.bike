const db = require("./db/Activity");

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
}
module.exports = Activity;
