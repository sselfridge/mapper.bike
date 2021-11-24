const dayjs = require("../../utils/dayjs");

const db = require("../../models/db/dataLayer");

const User = require("../../models/User");
const Segment = require("../../models/Segment");

class SegmentQueue {
  constructor() {
    this.pathlessSegments = [];
  }

  async process() {
    this.pathlessSegments = await db.getAllPathlessSegments();

    const segments = this.pathlessSegments.splice(0, 20);

    console.log("processPathlessSegments");
    console.info("Pathless segment length:", segments.length);
    if (segments.length === 0) {
      console.log("No pathless segments");
      return 0;
    }

    const ids = segments.map((segment) => segment.id);

    for (const id of ids) {
      let data = await this.getSegmentDetails(id);
      if (!data) {
        console.log("Error Fetching Data for Segment Id:", id);
        data = { id, line: "error" };
      } else {
        data.updated = dayjs().format();
      }
      await Segment.update(data);
    }
    return ids.length;
  }

  async getSegmentDetails(id) {
    console.info("Get segment details for:", id);
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
