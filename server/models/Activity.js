const db = require("./db/activity_aws");

const { fetchActivities } = require("../services/summaryServices");

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

  static addToActivityQueue = async (strava, afterDate = 0) => {
    try {
      const result = await fetchActivities(strava, afterDate, 2550000000);

      //TODO - this runs up against the DB provision limits...throttle this.

      await result.forEach(async (activity) => {
        if (!activity.line) return; //skip activities with no line
        await db.addActivity(activity.id, activity.athleteId);
      });
      console.log("Done Adding to DB");
    } catch (error) {
      console.error("Error while Adding to activity table:", error.message);
    }
  };
}
module.exports = Activity;
