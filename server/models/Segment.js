const _segmentDb = require("./db/segment_aws");

class Segment {
  static pop = async (limit) => {
    return await _segmentDb.pop(limit);
  };

  static get = async (id) => {
    return await _segmentDb.get(id);
  };

  static getAllPathless = async () => {
    return await _segmentDb.getAllPathless();
  };

  static updateSegment = async (data) => {
    await _segmentDb.update(data);
  };

  static deleteAll = async () => {
    const segments = await _segmentDb.getAll();
    while (segments.length > 0) {
      const batch = segments.slice(0, 20).map((s) => s.id);

      await _segmentDb.batchDelete(batch);
      segments.splice(0, 20);
      console.log("Batch Delete. Remaining:", segments.length);
    }
  };

  static batchAdd = async (segments) => {
    return await _segmentDb.batchAdd(segments);
  };
}

module.exports = Segment;
