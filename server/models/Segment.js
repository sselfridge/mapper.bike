const db = require("./db/segment_aws");

class Segment {
  static pop = async (limit) => {
    return await db.pop(limit);
  };

  static get = async (id) => {
    return await db.get(id);
  };

  static getAllPathless = async () => {
    return await db.getAllPathless();
  };

  static updateSegment = async (data) => {
    await db.update(data);
  };

  static deleteAll = async () => {
    const ids = await db.getAll();
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
