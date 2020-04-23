var AWS = require("aws-sdk");

//aws creds stored in ~/.aws/credentials
var credentials = new AWS.SharedIniFileCredentials({ profile: "dbuser" });
AWS.config.credentials = credentials;
AWS.config.update({ region: "us-west-2" });

var db = new AWS.DynamoDB();

module.exports = {
  addActivity(activity) {
    return new Promise((resolve, reject) => {
      const item = makeActivityItem(activity);

      var params = {
        TableName: "TestActivities",
        Item: item,
      };

      db.putItem(params, (err, data) => {
        if (err) {
          console.log("DB Error", err);
          return;
        }
        console.log("Added to DB");
        resolve(data);
      });
    });
  },
  getEmptyActivities() {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: "TestActivities",
        IndexName: "kind-index",
        KeyConditionExpression: "kind = :kind",
        ExpressionAttributeValues: {
          ":kind": { S: "summary" },
        },
        ProjectionExpression: "id",
      };

      db.query(params, (err, data) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(flatten(data));
        }
      });
    });
  },
  addSegmentEffort(effort) {
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
  },
  addSegment(segment) {
    return new Promise((resolve,reject)=>{
      var params = {
        TableName: "TestSegments",
        Item: {
          id: { N: `${segment.id}` },
          name: { S: segment.name },
          rank: { N: `${segment.rank}` },
          kind: { S: "full" },
          path: { S: segment.map.polyline},
          distance: {N: `${segment.distance}`},
          date: { S: segment.athlete_segment_stats.pr_date},
          elapsedTime: {N: `${segment.athlete_segment_stats.pr_elapsed_time}`}
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

    })
  },
  getPathlessSegments() {
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
          return resolve(flatten(data));
        }
      });
    });
  },

  getAllSegments() {
    return new Promise((resolve, reject) => {
      var params = {
        TableName: "TestSegments",
        Select: "ALL_ATTRIBUTES",
      };
      db.scan(params, (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(flatten(data));
      });
    });
  },
};

const makeActivityItem = (activity) => {
  let item = {};
  if (activity.segment_efforts) {
    item = {
      id: { N: `${activity.id}` },
      date: { N: `${activity.date}` },
      kind: { S: "full" },
      name: { S: activity.name },
      distance: { N: `${activity.distance}` },
      path: { S: activity.map.polyline },
      elapsedTime: { N: `${activity.elapsed_time}` },
    };
  } else {
    item = {
      id: { N: `${activity.id}` },
      date: { N: `${activity.date}` },
      kind: { S: "summary" },
    };
  }

  return item;
};



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


var descriptors = ['L', 'M', 'N', 'S'];

function flatten(o) {

  // flattens single property objects that have descriptors  
  for (let d of descriptors) {
    if (o.hasOwnProperty(d)) {
      return o[d];
    }
  }

  Object.keys(o).forEach((k) => {

    for (let d of descriptors) {
      if (o[k].hasOwnProperty(d)) {
        o[k] = o[k][d];
      }
    }
    if (Array.isArray(o[k])) {
      o[k] = o[k].map(e => flatten(e))
    } else if (typeof o[k] === 'object') {
      o[k] = flatten(o[k])
    }
  });

  return o;
}