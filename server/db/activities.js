const client = require("./config");

const TableName = "activities";

module.exports = {
  add,
  pop,
  batchDelete,
  countByAthelete,
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
        console.log("Activty Pop Error", err);
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
async function countByAthelete(id) {}

const makeBatchDeleteParams = (ids) => {
  var params = { RequestItems: {} };
  params.RequestItems[TableName] = [];
  ids.forEach((id) => {
    const newItem = { DeleteRequest: { Key: { id } } };
    params.RequestItems[TableName].push(newItem);
  });
  return params;
};
