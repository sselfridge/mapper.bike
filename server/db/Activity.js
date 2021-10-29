const client = require("./config");
const keys = require("../../src/config/keys");

const TableName = keys.dbTables["activities"];

module.exports = {
  add,
  pop,
  getAll,
  batchDelete,
  countByAthlete: countByAthlete,
};

function add(id, athleteId) {
  return new Promise((resolve, reject) => {
    var params = {
      TableName,
      Item: { id, athleteId },
    };

    client.put(params, (err) => {
      if (err) {
        console.log("DB Error", err);
        return reject(err);
      }
      console.log("Activity added to DB");
      resolve();
    });
  });
}

//return Limit activities
function pop(Limit) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName,
      Limit,
    };

    client.scan(params, (err, data) => {
      if (err) {
        console.log("Activity Pop Error", err);
        reject(err);
      } else {
        resolve(data.Items);
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
        console.log("get Effort Error", err);
        reject(err);
      } else {
        resolve(data.Items);
      }
    });
  });
}

function batchDelete(ids) {
  return new Promise((resolve, reject) => {
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

// eslint-disable-next-line no-unused-vars
async function countByAthlete(id) {}

const makeBatchDeleteParams = (ids) => {
  var params = { RequestItems: {} };
  params.RequestItems[TableName] = [];
  ids.forEach((id) => {
    const newItem = { DeleteRequest: { Key: { id } } };
    params.RequestItems[TableName].push(newItem);
  });
  return params;
};
