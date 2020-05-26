var client = require("./config");

const TableName = "segmentDetails";

module.exports = {
  update,
  batchAdd,
  pop,
  get,
};

function update(data) {
  const { id, line, effortCount, athleteCount, distance, elevation, updated } = data;
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
