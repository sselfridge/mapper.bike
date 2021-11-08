const dayjs = require("../../utils/dayjs");

const db = require("../../models/db/dataLayer");
const config = require("../../../src/config/keys");
var stravaAPI = require("strava-v3");
stravaAPI.config({
  client_id: config.client_id,
  client_secret: config.client_secret,
  redirect_uri: config.redirect_uri,
});

class ActivityQueue {
  //static functions:
  static async deleteAllActivities() {
    let count = 1;
    let round = 0;
    while (count > 0) {
      const activities = await db.popActivities(25);
      count = activities.length;
      await db.deleteActivities(activities.map((a) => a.id));
      round++;
      console.info("round: ", round);
    }
  }

  //   TODO this should be a part of a USER model or something similar
  static async updateUserRefreshToken(athleteId, result) {
    const user = await db.getUser(athleteId);
    if (
      user?.refreshToken !== result.refresh_token ||
      user?.accessToken !== result.access_token
    ) {
      user.refreshToken = result.refresh_token;
      user.accessToken = result.access_token;
      user.expiresAt = result.expires_at;
      console.log("user to DB: ", user);

      await db.updateUser(user);
    }
  }

  constructor() {
    this.appStrava = null;
    this.initDone = false;
    this.batchSize = 10;
    this.userStravaCache = {};
  }

  async init() {
    console.log("Init ActivityQueue");

    this.appStrava = await this.getStravaClient(config.client_refresh);

    this.initDone = true;
    return this;
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

    const activities = await db.popActivities(this.batchSize);

    console.log(`Getting full details for ${activities.length} activities`);
    if (activities.length === 0) return 0;
    for (const activity of activities) {
      try {
        const athleteId = activity.athleteId;

        const strava = await this.getClient(athleteId);

        const fullActivity = await strava.activities.get({
          id: activity.id,
          include_all_efforts: true,
        });

        const result = await this.parseActivity(fullActivity);
        if (result) completedActivityIds.push(activity.id);
      } catch (error) {
        console.log("Activity Detail Fetch Error:", activity.id, error.message);
        // TODO - add error field to activities so they can be skipped later
        // or maybe just log and delete them?
      }
    }
    if (completedActivityIds.length > 0)
      await db.deleteActivities(completedActivityIds);

    return completedActivityIds.length;
  }

  async getClient(athleteId) {
    if (this.userStravaCache[athleteId]) return this.userStravaCache[athleteId];

    const user = await db.getUser(athleteId);

    if (!user) throw new Error("User not defined in DB:", athleteId);

    //TODO - Add validation so accessToken matches up with user ID.
    //got this crossed for nigel in debugging and now I can't access any of his data
    const refreshResult = await stravaAPI.oauth.refreshToken(user.refreshToken);
    if (refreshResult.access_token !== user.accessToken) {
      user.accessToken = refreshResult.access_token;
      db.updateUser(user);
    }

    const strava = new stravaAPI.client(user.accessToken);

    this.userStravaCache[athleteId] = strava;
    return strava;
  }

  async parseActivity(activity) {
    if (!activity.map.summary_polyline) {
      console.log(`No poly line on activity ${activity.id} - skipping`);
      return true;
    }
    const rankedSegments = this.getRankedEfforts(activity);
    try {
      await db.storeSegments(rankedSegments);
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
        // console.log(`Saving Effort:${effort.name} with Rank:${effort.kom_rank}`);
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
