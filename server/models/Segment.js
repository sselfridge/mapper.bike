const db = require("./db/Segment");

class Segment {
  static pop = async (limit) => {
    return await Segment.pop(limit);
  };

  static getAllPathless = async () => {
    return await Segment.getAllPathless();
  };

  static updateSegment = async (data) => {
    await Segment.update(data);
  };

  static deleteAllSegments = async () => {
    const ids = db.getAll();
    while (ids.length > 0) {
      const batch = ids.slice(0, 20);
      await db.batchDelete(batch);
      ids.splice(0, 20);
      console.log("Batch Delete. Remaining:", ids.length);
    }
  };

  static batchAdd = async (segments) => {
    return await db.batchAdd(segments);
  };
}

module.exports = Segment;
