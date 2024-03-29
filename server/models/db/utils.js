const utils = {
  parseRankedSegments,
  generateUpdateQuery,
};

function parseRankedSegments(efforts) {
  const validEfforts = [];
  efforts.forEach((effort) => {
    if (validateEffort(effort) === false) {
      console.log("Invalid effort data for:", effort);
      return;
    }

    const validEffort = {
      id: effort.id,
      name: effort.segment.name,
      segmentId: effort.segment.id,
      athleteId: effort.athlete.id,
      activityId: effort.activity.id,
      date: effort.start_date,
      rank: effort.kom_rank,
    };
    validEfforts.push(validEffort);
  });
  return validEfforts;
}

function validateEffort(effort) {
  const {
    kom_rank,
    start_date,
    id,
    segment: { id: segmentId, name },
    athlete: { id: athleteId },
    activity: { id: activityId },
  } = effort;

  const retval =
    true &&
    !!kom_rank &&
    !!segmentId &&
    !!name &&
    !!athleteId &&
    !!activityId &&
    !!start_date &&
    !!id;

  return retval;
}

const validFields = {
  user: ["accessToken", "refreshToken", "startDate", "lastUpdate", "expiresAt"],
};

function generateUpdateQuery(fields, tableName) {
  let exp = {
    UpdateExpression: "set",
    ExpressionAttributeNames: {},
    ExpressionAttributeValues: {},
  };
  Object.entries(fields).forEach(([key, item]) => {
    if (validFields[tableName].includes(key) === false) return;
    exp.UpdateExpression += ` #${key} = :${key},`;
    exp.ExpressionAttributeNames[`#${key}`] = key;
    exp.ExpressionAttributeValues[`:${key}`] = item;
  });
  exp.UpdateExpression = exp.UpdateExpression.slice(0, -1);
  return exp;
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
