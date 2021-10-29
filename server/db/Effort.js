var client = require("./config");
const keys = require("../../src/config/keys");

const TableName = keys.dbTables["segmentEfforts"];

module.exports = {
  add,
  batchAdd,
  getByRank,
  batchDelete,
  get,
};

function add(segment) {
  const { segmentId, athleteId, name, rank, date } = segment;
  // console.log("DB: Adding effort on segment:", name);
  return new Promise((resolve, reject) => {
    var params = {
      TableName,
      Item: {
        id: `${segmentId}-${date}`, //effort ID's are not unique - using segmentID date combo
        segmentId,
        athleteId,
        name,
        rank,
        date,
      },
    };

    client.put(params, (err, data) => {
      if (err) {
        console.log(`DB Error on segment:${segmentId}`, err);
        return reject(err);
      }
      resolve(data);
    });
  });
}

async function batchAdd(efforts) {
  const promiseArr = efforts.map((segment) => add(segment));
  await Promise.all(promiseArr);
}

function getByRank(athleteId, rank) {
  return new Promise((resolve, reject) => {
    console.log("getting efforts for:", athleteId);
    const params = {
      TableName,
      IndexName: "athleteId-rank-index",
      KeyConditionExpression: "athleteId = :a AND #rank <= :r",
      ExpressionAttributeNames: { "#rank": "rank" },
      ExpressionAttributeValues: {
        ":a": athleteId,
        ":r": rank,
      },
    };

    client.query(params, (err, data) => {
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

function batchDelete(ids) {
  return new Promise((resolve, reject) => {
    if (ids.length === 0) resolve();

    const params = makeBatchDeleteParams(ids);

    client.batchWrite(params, (err) => {
      if (err) {
        reject(err);
      } else {
        console.log("Deleted Success");
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
