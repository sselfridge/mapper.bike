const dayjs = require("../../utils/dayjs");

//Models
const Activity = require("../../models/Activity");
const Effort = require("../../models/Effort");
const User = require("../../models/User");

const config = require("../../../src/config/keys");
var stravaAPI = require("strava-v3");
stravaAPI.config({
  client_id: config.client_id,
  client_secret: config.client_secret,
  redirect_uri: config.redirect_uri,
});

class ActivityQueue {
  constructor() {
    this.batchSize = 10;
    this.userStravaCache = {};
  }

  /**
   * Process activities in Q
   * @returns {number} Count of processed activities
   */
  //TODO maybe this should return the strava rate here so it doesn't have to be the strava Queue?
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
    if (completedActivityIds.length > 0)
      await Activity.delete(completedActivityIds);

    return completedActivityIds.length;
  }

  // async getClient(athleteId) {
  //   if (this.userStravaCache[athleteId]) return this.userStravaCache[athleteId];

  //   const user = await User.get(athleteId);

  //   if (!user) throw new Error("User not defined in DB:", athleteId);

  //   //TODO - Add validation so accessToken matches up with user ID.
  //   //got this crossed for nigel in debugging and now I can't access any of his data
  //   const refreshResult = await stravaAPI.oauth.refreshToken(user.refreshToken);
  //   if (refreshResult.access_token !== user.accessToken) {
  //     user.accessToken = refreshResult.access_token;
  //     User.update(user);
  //   }

  //   const strava = new stravaAPI.client(user.accessToken);

  //   this.userStravaCache[athleteId] = strava;
  //   return strava;
  // }

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

  //TODO this should probably move to a separate strava base resource
  async getStravaClient() {
    const refreshToken = config.client_refresh;
    const result = await stravaAPI.oauth.refreshToken(refreshToken);
    const expiresAt = dayjs.unix(result.expires_at);

    const localTime = expiresAt.format("hh:mm A");
    const gmtTime = expiresAt.utc().format("hh:mm");

    console.log(`App Token Expires at: ${localTime} (${gmtTime}GMT),`);

    console.log(expiresAt.fromNow());

    return new stravaAPI.client(result.access_token);
  }
}

module.exports = ActivityQueue;