const db = require("./db/effort_aws");
const Segment = require("./Segment");

class Effort {
  static getEfforts = async (athleteId, rank = 10) => {
    if (rank === "error") {
      return await db.getErrors(athleteId);
    } else {
      return await db.getByRank(athleteId, rank);
    }
  };

  static get = async (id) => {
    return await Effort.get(id);
  };

  static batchAdd = async (efforts) => {
    return await db.batchAdd(efforts);
  };

  static delete = async (data) => {
    const ids = data.slice();
    while (ids.length > 0) {
      const batch = ids.slice(0, 20);
      await db.batchDelete(batch);
      ids.splice(0, 20);
    }
  };

  static deleteAllEfforts = async () => {
    const ids = db.getAll();

    while (ids.length > 0) {
      const batch = ids.slice(0, 20);
      await db.batchDelete(batch);
      ids.splice(0, 20);
      console.log("Batch Delete. Remaining:", ids.length);
    }
  };

  //Effort + Segment combo logic

  static getEffortsWithPath = async (athleteId, rank = 10) => {
    try {
      const results = await this.getEfforts(athleteId, rank);

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
  };

  static storeSegments = async (data) => {};
}

module.exports = Effort;
