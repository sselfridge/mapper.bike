const utils = {
  parseRankedSegments,
  parseSegmentDetails,
};

function parseRankedSegments(efforts) {
  return efforts.map((effort) => ({
    id: effort.id,
    name: effort.segment.name,
    segmentId: effort.segment.id,
    athleteId: effort.athlete.id,
    activity: effort.activity.id,
    date: effort.start_date,
    rank: effort.kom_rank,
  }));
}

function parseSegmentDetails(efforts) {
  return efforts.map((effort) => ({ id: effort.segment.id }));
}

// eslint-disable-next-line no-unused-vars
const segment_Effort = {
  id: 2689197347790957000,
  resource_state: 2,
  name: "MK Coast TT",
  activity: { id: 3352762323, resource_state: 1 },
  athlete: { id: 1075670, resource_state: 1 },
  elapsed_time: 2679,
  moving_time: 2679,
  start_date: "2020-04-25T18:22:17Z",
  start_date_local: "2020-04-25T11:22:17Z",
  distance: 31521.6,
  start_index: 1364,
  end_index: 4043,
  average_cadence: 89.4,
  device_watts: true,
  average_watts: 373.9,
  average_heartrate: 164.1,
  max_heartrate: 177,
  segment: {
    id: 8860292,
    resource_state: 2,
    name: "MK Coast TT",
    activity_type: "Ride",
    distance: 31521.6,
    average_grade: -0.1,
    maximum_grade: 47.1,
    elevation_high: 130.2,
    elevation_low: 52,
    start_latlng: [34.02648, -118.514158],
    end_latlng: [34.029766, -118.522842],
    start_latitude: 34.02648,
    start_longitude: -118.514158,
    end_latitude: 34.029766,
    end_longitude: -118.522842,
    climb_category: 0,
    city: "Santa Monica",
    state: "California",
    country: "United States",
    private: false,
    hazardous: false,
    starred: false,
  },
  pr_rank: null,
  achievements: [{ type_id: 2, type: "overall", rank: 1 }],
  kom_rank: 1,
  hidden: true,
};

module.exports = utils;
