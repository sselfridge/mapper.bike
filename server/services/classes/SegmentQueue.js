const dayjs = require("../../utils/dayjs");

const db = require("../../models/db/dataLayer");

const User = require("../../models/User");
const Segment = require("../../models/Segment");

const _stravaAPI = global._stravaAPI;

class SegmentQueue {
  constructor() {
    this.pathlessSegments = [];
  }

  async getStravaClient(refreshToken) {
    const result = await _stravaAPI.oauth.refreshToken(refreshToken);
    const expiresAt = dayjs.unix(result.expires_at);

    const localTime = expiresAt.format("hh:mm A");
    const gmtTime = expiresAt.utc().format("hh:mm");

    console.log(`App Token Expires at: ${localTime} (${gmtTime}GMT),`);
    console.log(expiresAt.fromNow());

    return new _stravaAPI.client(result.access_token);
  }

  async process() {
    this.pathlessSegments = await db.getAllPathlessSegments();

    const segments = this.pathlessSegments.splice(0, 20);

    console.log("processPathlessSegments");

    const ids = segments.map((segment) => segment.id);

    if (ids.length === 0) return 0;

    for (const id of ids) {
      let data = await this.getSegmentDetails(id);
      if (!data) {
        console.log("Error Fetching Data for Segment Id:", id);
        data = { id, line: "error" };
      } else {
        data.updated = dayjs().format();
      }
      console.info("Data Obtained:");
      await Segment.update(data);
    }
    return ids.length;
  }

  async getSegmentDetails(id) {
    try {
      const result = await User.getFullSegment(id);
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
