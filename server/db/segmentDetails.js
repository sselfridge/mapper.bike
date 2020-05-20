const utils = require("./utils");
var client = require("./config");

const TableName = "segmentDetails";

module.exports = {
  update,
  batchAdd,
  pop,
  get,
};

function update(data) {
  const { id, line, effortCount, athleteCount, distance, elevation } = data;
  console.log("segment Detail Update");
  console.log(data);
  return new Promise((resolve, reject) => {
    const params = {
      TableName: "segmentDetails",
      Key: { id },
    };

    console.log("line");
    console.log(line);

    if (line) {
      params.UpdateExpression = "set #p = :p, #h = :h, #ec = :ec, #ac = :ac, #d = :d, #e = :e";
      params.ExpressionAttributeNames = {
        "#p": "line",
        "#h": "hasLine",
        "#ec": "effortCount",
        "#ac": "athleteCount",
        "#d": "distance",
        "#e": "elevation",
      };

      if (line === "error") {
        params.ExpressionAttributeValues = {
          ":p": line,
          ":h": "error",
          ":ec": effortCount,
          ":ac": athleteCount,
          ":d": distance,
          ":e": elevation,
        };
      } else {
        params.ExpressionAttributeValues = {
          ":p": line,
          ":h": "true",
          ":ec": effortCount,
          ":ac": athleteCount,
          ":d": distance,
          ":e": elevation,
        };
      }
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
          console.log("Condition Check Failed");
          return resolve();
        } else {
          //reject all other errors
          console.log("Segment Details Err");
          console.log(err.message);
          return reject(err);
        }
      } else {
        return resolve();
      }
    });
  });
}

function batchAdd(segments) {
  const promiseArr = segments.map((segment) => update(segment));
  return Promise.all(promiseArr);
}

function pop(Limit, value = "false") {
  return new Promise((resolve, reject) => {
    const params = {
      TableName,
      IndexName: "hasLine-index",
      KeyConditionExpression: "hasLine = :h",
      ExpressionAttributeValues: {
        ":h": value,
      },
      Limit,
      // ProjectionExpression: "ALL",
    };

    client.query(params, (err, data) => {
      if (err) {
        console.log(err);
        return reject(err);
      } else {
        return resolve(data.Items);
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
