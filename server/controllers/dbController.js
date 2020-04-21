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
        resolve(data);
      });
    });
  },
  getEmptyActivities() {
    return new Promise((resolve, reject) => {
      var params = {
        TableName: "TestActivities",
        ScanFilter: {
          path: {
            ComparisonOperator: "NULL",
          },
        },
        Select: "ALL_ATTRIBUTES",
      };
      db.scan(params, (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  },
  addSegment(effort) {
    return new Promise((resolve, reject) => {
      var params = {
        TableName: "TestSegments",
        Item: {
          id: { N: effort.segment.id },
          name: { S: effort.segment.name },
          rank: { N: effort.kom_rank },
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
  getPathlessSegments() {
    return new Promise((resolve, reject) => {
      var params = {
        TableName: "TestSegments",
        ScanFilter: {
          path: {
            ComparisonOperator: "NULL",
          },
        },
        Select: "ALL_ATTRIBUTES",
      };
      db.scan(params, (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  },

  getAllSegments() {
    return new Promise((resolve, reject) => {
      var params = {
        TableName: "TestActivites",
        Select: "ALL_ATTRIBUTES",
      };
      db.scan(params, (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
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
    };
  } else {
    item = {
      id: { N: `${activity.id}` },
      date: { N: `${activity.date}` },
      name: { S: activity.name },
      distance: { N: `${activity.distance}` },
      path: { S: activity.map.polyline },
      elapsedTime: { N: `${activity.elapsedTime}` },
    };
  }

  return item;
};
