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

    const activities = await Activity.pop(this.batchSize);

    console.log(`Getting full details for ${activities.length} activities`);
    if (activities.length === 0) return 0;

    const results = await Promise.allSettled(
      activities.map((a) => this.handleFetchActivity(a))
    );

    const completedActivityIds = [];
    const errorActivityIds = [];

    results.forEach((r, i) => {
      if (r.status === "fulfilled") {
        completedActivityIds.push({ id: activities[i].id });
      } else {
        errorActivityIds.push({ id: activities[i].id });
      }
    });

    console.log("Completed activities", completedActivityIds);
    if (errorActivityIds.length > 0) {
      console.log("Error activities:", errorActivityIds);
      completedActivityIds.concat(errorActivityIds);
    }

    if (completedActivityIds.length > 0) {
      await Activity.delete(completedActivityIds);
    }

    return completedActivityIds.length;
  }

  async handleFetchActivity(activity) {
    const { athleteId, id } = activity;
    const fullActivity = await User.getFullActivity(athleteId, id);

    await this.parseActivity(fullActivity);
  }

  /**
   * Parse full activity for ranked segments
   * @param {object} activity
   * @returns {boolean} false if error occurs
   */
  async parseActivity(activity) {
    if (!activity.map.summary_polyline) {
      console.log(`No poly line on activity ${activity.id} - skipping`);
      return;
    }
    const rankedSegments = this.getRankedEfforts(activity);
    await Effort.storeSegments(rankedSegments);
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
