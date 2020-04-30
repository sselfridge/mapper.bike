var AWS = require("aws-sdk");

//aws creds stored in ~/.aws/credentials
var credentials = new AWS.SharedIniFileCredentials({ profile: "dbuser" });
AWS.config.credentials = credentials;
AWS.config.update({ region: "us-west-2" });
const utils = require("./utils");

var db = new AWS.DynamoDB();

module.exports = {
  add,
  pop,
  getAllEmptyActivities,
  remove,
  countByAthelete,
};

function add(data) {
  return new Promise((resolve, reject) => {
    const item = makeActivityItem(data);

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
}

//return 1 activity
function pop() {}

function getAllEmptyActivities() {
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
        return resolve(utils.flatten(data));
      }
    });
  });
}

async function remove(id) {}

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

async function countByAthelete(id) {}

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
