const _effortDb = require("./db/effort_aws");
const Segment = require("./Segment");

const utils = require("./db/utils");
const User = require("./User");

const { appendLeaderboard } = require("../../src/utils/helperFunctions");

class Effort {
  static getEfforts = async (athleteId, rank = 10) => {
    if (rank === "error") {
      return await _effortDb.getErrors(athleteId);
    } else {
      return await _effortDb.getByRank(athleteId, rank);
    }
  };

  static get = async (id) => {
    return await Effort.get(id);
  };

  static batchAdd = async (efforts) => {
    return await _effortDb.batchAdd(efforts);
  };

  static delete = async (data) => {
    const ids = data.slice();
    while (ids.length > 0) {
      const batch = ids.slice(0, 20);
      await _effortDb.batchDelete(batch);
      ids.splice(0, 20);
    }
  };

  static deleteAll = async () => {
    const efforts = await _effortDb.getAll();

    while (efforts.length > 0) {
      const batch = efforts.slice(0, 20).map((e) => e.id);
      await _effortDb.batchDelete(batch);
      efforts.splice(0, 20);
      console.log("Batch Delete. Remaining:", efforts.length);
    }
  };

  //Effort + Segment combo logic

  static getEffortsWithPath = async (user, rank = 10) => {
    try {
      const { athleteId } = user;
      const efforts = await this.getEfforts(athleteId, rank);

      const promArray = efforts.map((effort) => Segment.get(effort.segmentId));
      const segmentDetails = await Promise.all(promArray);

      //TODO - this expects all the detail fetches to work, if this keeps erroring need to rework it.

      segmentDetails.forEach((detail, i) => {
        if (detail && efforts[i].segmentId === detail.id) {
          efforts[i].athleteCount = detail.athleteCount;
          efforts[i].distance = detail.distance;
          efforts[i].effortCount = detail.effortCount;
          efforts[i].elevation = detail.elevation;
          efforts[i].line = detail.line;
          efforts[i].updated = detail.updated;

          if (detail.leaderboard) {
            efforts[i].currentRank = appendLeaderboard(
              efforts[i].activityId,
              detail.leaderboard
            );
          }
        } else {
          console.error(
            "Error Mapping segment details to effort",
            detail?.id,
            efforts[i]?.segmentId
          );
        }
      });
      return efforts;
    } catch (error) {
      console.log("Error:", error.message);
      console.log(error);
      return [];
    }
  };

  // static appendLeaderboard = (activityId, leaderboard) => {
  //   const current = leaderboard.find((e) => e.activityId === `${activityId}`);

  //   if (current) {
  //     return parseInt(current.place, 10);
  //   } else {
  //     return "--";
  //   }
  // };

  //TODO test this
  static storeSegments = async (segmentSummaries) => {
    const rankedSegments = utils.parseRankedSegments(segmentSummaries);

    const segments = segmentSummaries.map((segment) => ({
      id: segment.segment.id,
    }));

    await Promise.all([
      this.batchAdd(rankedSegments),
      Segment.batchAdd(segments),
    ]);
  };

  static appendLeaderboardToEffort = (effort, segment) => {};
}

module.exports = Effort;
