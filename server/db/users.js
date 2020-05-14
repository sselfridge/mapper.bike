const client = require("./config");

const TableName = "users";

const users = {
  update,
  get,
  exists,
  remove,
};

function update(data) {
  return new Promise((resolve,reject)=>{
  const { id, accessToken, refreshToken } = data;

  const params = {
    TableName,
    Key: { id },
    UpdateExpression: "set #a = :a, #r = :r",
    ExpressionAttributeNames: { "#a": "accessToken", "#r": "refreshToken" },
    ExpressionAttributeValues: {
      ":a": accessToken,
      ":r": refreshToken,
    },
  };

  client.update(params, (err, data) => {
    if (err) {
      console.log("User Update Error", err);
      reject(err)
    } else {
      resolve(data)
    }
  });
})
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

module.exports = users;
