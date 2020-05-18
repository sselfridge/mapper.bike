const utils = require("./utils");
var client = require("./config");

const TableName = "segmentRanks";

module.exports = {
  add,
  batchAdd,
  get,
  batchDelete,
};

function add(segment) {
  const { id, segmentId, athleteId, name, rank, date } = segment;

  return new Promise((resolve, reject) => {
    var params = {
      TableName,
      Item: {
        id,
        segmentId,
        athleteId,
        name,
        rank,
        date,
      },
    };

    client.put(params, (err, data) => {
      if (err) {
        console.log("DB Error", err);
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

function get(athleteId, rank) {
  return new Promise((resolve, reject) => {
    console.log("get efforts.js");
    console.log(athleteId);
    console.log(typeof rank);
    const params = {
      TableName: "segmentRanks",
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