var AWS = require("aws-sdk");

//aws creds stored in ~/.aws/credentials
var credentials = new AWS.SharedIniFileCredentials({ profile: "dbuser" });
AWS.config.credentials = credentials;
AWS.config.update({ region: "us-west-2" });
const utils = require('./utils')
var db = new AWS.DynamoDB();

module.exports = {
  addSegment,
  getAllSegments,
  getPathlessSegments
};

function addSegmentEffort(effort) {
  return new Promise((resolve, reject) => {
    var params = {
      TableName: "TestSegments",
      Item: {
        id: { N: `${effort.segment.id}` },
        name: { S: effort.segment.name },
        rank: { N: `${effort.kom_rank}` },
        kind: { S: "summary" },
      },
    };

    db.putItem(params, (err, data) => {
      if (err) {
        console.log("DB Error", err);
        return reject(err);
      }
      resolve(data);
    });
  });
}
function addSegment(segment) {
  return new Promise((resolve, reject) => {
    var params = {
      TableName: "TestSegments",
      Item: {
        id: { N: `${segment.id}` },
        name: { S: segment.name },
        rank: { N: `${segment.rank}` },
        kind: { S: "full" },
        path: { S: segment.map.polyline },
        distance: { N: `${segment.distance}` },
        date: { S: segment.athlete_segment_stats.pr_date },
        elapsedTime: { N: `${segment.athlete_segment_stats.pr_elapsed_time}` },
      },
    };

    db.putItem(params, (err, data) => {
      if (err) {
        console.log("DB Error", err);
        return reject(err);
      }
      console.log(`Added to DB: ${segment.name}`);
      resolve(data);
    });
  });
}
function getPathlessSegments() {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: "TestSegments",
      IndexName: "kind-index",
      KeyConditionExpression: "kind = :kind",
      ExpressionAttributeValues: {
        ":kind": { S: "summary" },
      },
      // ProjectionExpression: "ALL",
    };

    db.query(params, (err, data) => {
      if (err) {
        console.log(err);
        return reject(err);
      } else {
        return resolve(utils.flatten(data));
      }
    });
  });
}

function getAllSegments() {
  return new Promise((resolve, reject) => {
    var params = {
      TableName: "TestSegments",
      Select: "ALL_ATTRIBUTES",
    };
    db.scan(params, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(utils.flatten(data));
    });
  });
}



const queryIndex = (field, equals) => {
  const params = {
    TableName: "TestActivities",
    IndexName: "kind-index",
    KeyConditionExpression: "kind = :kind",
    ExpressionAttributeValues: {
      ":kind": { S: "full" },
    },
    // ProjectionExpression: "ALL",
  };

  db.query(params, (err, data) => {
    if (err) {
      console.log(err);
    } else console.log(data);
  });
};


