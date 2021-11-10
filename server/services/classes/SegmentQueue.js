const dayjs = require("../../utils/dayjs");

const db = require("../../models/db/dataLayer");

const User = require("../../models/User");

const config = require("../../../src/config/keys");
var stravaAPI = require("strava-v3");
stravaAPI.config({
  client_id: config.client_id,
  client_secret: config.client_secret,
  redirect_uri: config.redirect_uri,
});

class SegmentQueue {
  constructor() {
    this.pathlessSegments = [];
  }

  async getStravaClient(refreshToken) {
    const result = await stravaAPI.oauth.refreshToken(refreshToken);
    const expiresAt = dayjs.unix(result.expires_at);

    const localTime = expiresAt.format("hh:mm A");
    const gmtTime = expiresAt.utc().format("hh:mm");

    console.log(`App Token Expires at: ${localTime} (${gmtTime}GMT),`);
    console.log(expiresAt.fromNow());

    return new stravaAPI.client(result.access_token);
  }

  async process() {
    const segments = this.pathlessSegments.splice(0, 20);

    console.log("processPathlessSegments");

    const ids = segments.map((segment) => segment.id);

    if (ids.length === 0) return 0;

    for (const id of ids) {
      let data = await User.getFullSegment(id);
      if (!data) {
        console.log("Error Fetching Data for Segment Id:", id);
        data = { id, line: "error" };
      } else {
        data.updated = dayjs().format();
      }
      await db.updateSegment(data);
    }
    return ids.length;
  }

  async getSegmentDetails(id) {
    try {
      const result = await this.appStrava.segments.get({ id });
      return {
        id: result.id,
        line: result.map.polyline,
        effortCount: result.effort_count,
        athleteCount: result.athlete_count,
        distance: result.distance,
        elevation: result.total_elevation_gain,
      };
    } catch (error) {
      console.log(`Error on id:${id}::`, error.message);
    }
  }
}

module.exports = SegmentQueue;
