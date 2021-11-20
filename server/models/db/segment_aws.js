var client = require("./config");
const keys = require("../../../src/config/keys");

const TableName = keys.dbTables["segmentDetails"];

module.exports = {
  update,
  batchAdd,
  pop,
  getAllPathless,
  get,
  getAll,
  batchDelete,
};

function update(data) {
  const { id, line, effortCount, athleteCount, distance, elevation, updated } =
    data;
  return new Promise((resolve, reject) => {
    const params = {
      TableName,
      Key: { id },
    };

    if (line) {
      if (line === "error") {
        console.log("Logging Error detail");
        params.UpdateExpression = "set #p = :p, #h = :h";
        params.ExpressionAttributeNames = {
          "#p": "line",
          "#h": "hasLine",
        };

        params.ExpressionAttributeValues = {
          ":p": line,
          ":h": "error",
        };
      } else if (line === "reset") {
        console.log("Attempting to reset values");

        params.UpdateExpression = "SET #h = :h REMOVE #p";
        params.ExpressionAttributeNames = {
          "#p": "line",
          "#h": "hasLine",
        };

        params.ExpressionAttributeValues = {
          // ":p": null,
          ":h": "false",
        };
      } else {
        params.UpdateExpression =
          "set #p = :p, #h = :h, #ec = :ec, #ac = :ac, #d = :d, #e = :e, #u = :u";
        params.ExpressionAttributeNames = {
          "#p": "line",
          "#h": "hasLine",
          "#ec": "effortCount",
          "#ac": "athleteCount",
          "#d": "distance",
          "#e": "elevation",
          "#u": "updated",
        };
        params.ExpressionAttributeValues = {
          ":p": line,
          ":h": "true",
          ":ec": effortCount,
          ":ac": athleteCount,
          ":d": distance,
          ":e": elevation,
          ":u": updated,
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
          console.log("Segment already in DB:", id);
          return resolve();
        } else {
          //reject all other errors
          console.log("Segment Details Err");
          console.log("Error On Data:");
          console.log(data);
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

function getAllPathless() {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: "segmentDetails-dev",
      ConditionExpression: "attribute_not_exists(line)",
      FilterExpression: "#hasLine = :hasLine",
      ExpressionAttributeValues: {
        ":hasLine": "false",
      },
      ExpressionAttributeNames: {
        "#hasLine": "hasLine",
      },
      // Select: "SPECIFIC_ATTRIBUTES",
      // AttributesToGet: ["id"],
    };

    client.scan(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Items);
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

function getAll() {
  return new Promise((resolve, reject) => {
    const params = {
      TableName,
      Select: "SPECIFIC_ATTRIBUTES",
      AttributesToGet: ["id"],
    };

    client.scan(params, (err, data) => {
      if (err) {
        console.log("get Segment Details Error", err);
        reject(err);
      } else {
        resolve(data.Items);
      }
    });
  });
}

/**
 * Batch Delete of up to 25 items at a time
 * @param {number[]} ids
 */
function batchDelete(ids) {
  console.log("Batch Segment delete", ids.length);

  return new Promise((resolve, reject) => {
    if (ids.length === 0) resolve();

    const params = makeBatchDeleteParams(ids);

    client.batchWrite(params, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

const makeBatchDeleteParams = (ids) => {
  var params = { RequestItems: {} };
  params.RequestItems[TableName] = [];
  ids.forEach((id) => {
    const newItem = { DeleteRequest: { Key: { id } } };
    params.RequestItems[TableName].push(newItem);
  });
  return params;
};
