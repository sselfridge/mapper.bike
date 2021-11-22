const _activityDb = require("./db/activity_aws");

class Activity {
  static add = async (id, athleteId) => {
    await _activityDb.add(id, athleteId);
  };

  /**
   * Deletes
   * @param {number[]} ids to be deleted
   */
  static delete = async (paramIds) => {
    const ids = paramIds.slice();
    while (ids.length > 0) {
      const batch = ids.slice(0, 20);
      const idsOnly = batch.map((a) => a.id);
      await _activityDb.batchDelete(idsOnly);
      ids.splice(0, 20);
    }
  };

  static pop = async (limit) => {
    return await _activityDb.pop(limit);
  };

  static deleteAll = async () => {
    const ids = await _activityDb.getAll();
    while (ids.length > 0) {
      console.log("Batch Delete. Remaining:", ids.length);
      const batch = ids.slice(0, 20).map((a) => a.id);
      await _activityDb.batchDelete(batch);
      ids.splice(0, 20);
    }
  };

  /**
   * Add entries to activity queue if they have a polyline
   * @param {array} activities
   * @param {number} athleteId
   */
  static batchAdd = async (activities, athleteId) => {
    //TODO - test if this still hits the DB limit

    while (activities.length > 0) {
      const batchSize = 25;
      const batch = activities.slice(0, batchSize).filter((act) => act.line);

      await _activityDb.batchAdd(batch, athleteId);

      activities.splice(0, batchSize);
    }
  };
}
module.exports = Activity;
