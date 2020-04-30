const db = require("./config");

const TableName = "activities";

module.exports = {
  add,
  pop,
  getAllEmptyActivities,
  remove,
  countByAthelete,
};

function add(id, athleteId) {
  console.log('Running Add');
  return new Promise((resolve, reject) => {
    var params = {
      TableName,
      Item: { id, athleteId },
    };



    db.put(params, (err, data) => {
      if (err) {
        console.log("DB Error", err);
        return reject(err);
      }
      console.log("Added to DB");
      resolve();
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
        return resolve(flatten(data));
      }
    });
  });
}

async function remove(id) {}

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
