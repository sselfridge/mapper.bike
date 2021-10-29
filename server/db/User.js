const client = require("./config");
const keys = require("../../src/config/keys");

const TableName = keys.dbTables["users"];

const users = {
  update,
  get,
  getAll,
  exists,
  remove,
  batchDelete
};

function update(data) {
  return new Promise((resolve, reject) => {
    const { id, accessToken, refreshToken, startDate, lastUpdate } = data;

    const params = {
      TableName,
      Key: { id },
      UpdateExpression: "set #a = :a, #r = :r, #sd = :sd, #lu = :lu",
      ExpressionAttributeNames: {
        "#a": "accessToken",
        "#r": "refreshToken",
        "#sd": "startDate",
        "#lu": "lastUpdate",
      },
      ExpressionAttributeValues: {
        ":a": accessToken,
        ":r": refreshToken,
        ":sd": startDate,
        ":lu": lastUpdate,
      },
    };

    client.update(params, (err, data) => {
      if (err) {
        console.log("User Update Error", err);
        reject(err);
      } else {
        resolve(data);
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
        console.log("getUser Error", err);
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
      AttributesToGet: [
        "id",
        "lastUpdate",
        "accessToken",
        "refreshToken",
        "startDate",
      ],
    };

    client.scan(params, (err, data) => {
      if (err) {
        console.log("get all users error", err);
        reject(err);
      } else {
        resolve(data.Items);
      }
    });
  });
}

function exists(id) {
  return new Promise((resolve, reject) => {
    get(id)
      .then((user) => {
        if (user) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((err) => reject(err));
  });
}

function remove(id) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName,
      Key: {
        id,
      },
    };

    client.delete(params, function (err) {
      if (err) reject(err);
      else resolve();
    });
  });
}

function batchDelete(ids) {
  console.log("Batch User delete", ids.length);

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

module.exports = users;
