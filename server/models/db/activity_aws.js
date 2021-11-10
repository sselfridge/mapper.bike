const client = require("./config");
const keys = require("../../../src/config/keys");

const TableName = keys.dbTables["activities"];

module.exports = {
  add,
  batchAdd,
  pop,
  getAll,
  batchDelete,
  countByAthlete,
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

      resolve();
    });
  });
}

function batchAdd(activities, athleteId) {
  return new Promise((resolve, reject) => {
    if (activities.length > 25) return reject("Max of 25 items per batch");

    const params = makeBatchAddParams(activities, athleteId);

    client.batchWrite(params, (err, res) => {
      if (err) {
        reject(err);
      } else {
        console.log("Batch Add Completed:", activities.length);
        resolve();
      }
    });
  });
}

const makeBatchAddParams = (activities, athleteId) => {
  var params = { RequestItems: {} };
  params.RequestItems[TableName] = [];
  activities.forEach((act) => {
    const newItem = { PutRequest: { Item: { id: act.id, athleteId } } };
    params.RequestItems[TableName].push(newItem);
    // params.ReturnConsumedCapacity = "INDEXES";
  });
  return params;
};

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

/**
 * Batch Delete of up to 25 items at a time
 * @param {number[]} ids
 */
function batchDelete(ids) {
  return new Promise((resolve, reject) => {
    if (ids.length > 25) return reject("Max of 25 items per batch");
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
