const client = require("./config");

const TableName = "users";

const users = {
  exists,
  get,
  update,
  remove,
};

function update(data) {
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
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
  });
}

function get(id) {
  console.log("Get User Func");
  return new Promise((resolve, reject) => {
    const params = {
      Key: {
        id,
      },
      TableName,
    };

    console.log("params");
    console.log(params);

    client.get(params, (err, data) => {
      if (err) {
        console.log("getUser Error", err);
        reject(err);
      } else {
        console.log("getUser Data");
        console.log(data);
        resolve(data.Item);
      }
    });
  });
}

function exists(id) {
  console.log("user Exists func");
  return new Promise((resolve, reject) => {
    get(id)
      .then((user) => {
        if (user) {
          console.log('Resolving as true');

          resolve(true);
        } else {
          console.log('Resolving as false');
          console.log(user);
          resolve(false);
        }
      })
      .catch((err) => reject(err));
  });
}

function remove(id) {
  return new Promise((resolve, reject) => {});
}

module.exports = users;
