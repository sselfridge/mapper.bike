//Models
const Activity = require("../../models/Activity");
const Effort = require("../../models/Effort");
const User = require("../../models/User");

class ActivityQueue {
  constructor() {
    this.batchSize = 10;
    this.userStravaCache = {};
  }

  /**
   * Process activities in Q
   * @returns {number} Count of processed activities
   */
  async process() {
    if (this.initDone === false) {
      throw new Error("Initialize Activity queue before using, run init() ");
    }
    const completedActivityIds = [];

    const activities = await Activity.pop(this.batchSize);

    console.log(`Getting full details for ${activities.length} activities`);
    if (activities.length === 0) return 0;
    for (const activity of activities) {
      try {
        const { athleteId, id } = activity;
        const fullActivity = await User.getFullActivity(athleteId, id);

        const result = await this.parseActivity(fullActivity);
        if (result) completedActivityIds.push({ id });
      } catch (error) {
        console.log("Activity Detail Fetch Error:", activity.id, error.message);
        // TODO - add error field to activities so they can be skipped later
        // or maybe just log and delete them?
      }
    }
    console.info("Completed activities", completedActivityIds);
    if (completedActivityIds.length > 0) {
      await Activity.delete(completedActivityIds);
    }

    return completedActivityIds.length;
  }

  /**
   * Parse full activity for ranked segments
   * @param {object} activity
   * @returns {boolean} false if error occurs
   */
  async parseActivity(activity) {
    if (!activity.map.summary_polyline) {
      console.log(`No poly line on activity ${activity.id} - skipping`);
      return true;
    }
    const rankedSegments = this.getRankedEfforts(activity);
    try {
      await Effort.storeSegments(rankedSegments);
    } catch (error) {
      console.log("Store Segment Error", error.message);
      return false;
    }
    return true;
  }

  getRankedEfforts(activity) {
    const rankedEfforts = [];
    if (!activity.segment_efforts) {
      console.log("No Segment efforts on Activity");
      return [];
    }

    activity.segment_efforts.forEach((effort) => {
      if (effort.kom_rank <= 10 && effort.kom_rank > 0) {
        console.log(
          `Saving Effort:${effort.name} with Rank:${effort.kom_rank}`
        );
        rankedEfforts.push(effort);
      }
    });

    return rankedEfforts;
  }
}

module.exports = ActivityQueue;
