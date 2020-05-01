const utils = require("./utils");
var client = require("./config");

const TableName = "segmentDetails";

module.exports = {
  update,
  batchUpdate,
  pop,
  get,
};

function update(data) {
  const { id, line } = data;

  return new Promise((resolve, reject) => {
    const params = {
      TableName: "segmentDetails",
      Key: { id },
    };

    if (line) {
      params.UpdateExpression = "set #p = :p, #h = :h";
      params.ExpressionAttributeNames = { "#p": "line", "#h": "hasLine" };
      params.ExpressionAttributeValues = {
        ":p": line,
        ":h": "true",
      };
    } else {
      params.UpdateExpression = "set #h = :h";
      params.ExpressionAttributeNames = { "#h": "hasLine" };
      params.ConditionExpression = "attribute_not_exists(hasLine)";
      params.ExpressionAttributeValues = {
        ":h": "false",
      };
    }

    client.update(params, (err) => {
      if (err) {
        if (err.code === "ConditionalCheckFailedException") {
          // conditions not met, update aborted
          return resolve();
        } else {
          //reject all other errors
          return reject(err);
        }
      } else {
        resolve();
      }
    });
  });
}

function batchUpdate(segments) {
  const promiseArr = segments.map((segment) => update(segment));
  return Promise.all(promiseArr);
}

function pop() {
  return new Promise((resolve, reject) => {
    const params = {
      TableName,
      IndexName: "line-index",
      KeyConditionExpression: "line = :p",
      ExpressionAttributeValues: {
        ":p": null,
      },
      // ProjectionExpression: "ALL",
    };

    client.query(params, (err, data) => {
      if (err) {
        console.log(err);
        return reject(err);
      } else {
        return resolve(data);
      }
    });
  });
}

function get(id) {
  return new Promise((resolve, reject) => {
    const params = {
      Key: {
        id,
      },
      TableName,
    };

    client.get(params, (err, data) => {
      if (err) {
        console.log("get Segment Details Error", err);
        reject(err);
      } else {
        resolve(data.Item);
      }
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

  client.query(params, (err, data) => {
    if (err) {
      console.log(err);
    } else console.log(data);
  });
};
