const utils = require('./utils')
var client = require('./config')

const TableName = 'segmentDetails'

module.exports = {
  add,
  pop,
  get,
};

function add(data) {
  const {id, path} = data;

  return new Promise((resolve, reject) => {
    var params = {
      TableName,
      Item: {
        id ,
        path,
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


function pop() {
  return new Promise((resolve, reject) => {
    const params = {
      TableName,
      IndexName: "kind-index",
      KeyConditionExpression: "kind = :kind",
      ExpressionAttributeValues: {
        ":kind": undefined,
      },
      // ProjectionExpression: "ALL",
    };

    client.query(params, (err, data) => {
      if (err) {
        console.log(err);
        return reject(err);
      } else {
        return resolve(data);
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



const queryIndex = (field, equals) => {
  const params = {
    TableName: "TestActivities",
    IndexName: "kind-index",
    KeyConditionExpression: "kind = :kind",
    ExpressionAttributeValues: {
      ":kind": { S: "full" },
    },
    // ProjectionExpression: "ALL",
  };

  client.query(params, (err, data) => {
    if (err) {
      console.log(err);
    } else console.log(data);
  });
};


