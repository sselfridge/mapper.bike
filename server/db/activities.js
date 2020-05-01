const client = require("./config");

const TableName = "activities";

module.exports = {
  add,
  pop,
  remove,
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

    client.batchWrite(params, (err,data)=>{
      if(err){
        reject(err);
      }else{
        resolve();
      }
    })

  });
}

function getAllEmptyActivities() {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: "TestActivities",
      IndexName: "kind-index",
      KeyConditionExpression: "kind = :kind",
      ExpressionAttributeValues: {
        ":kind": { S: "summary" },
      },
      ProjectionExpression: "id",
    };

    client.query(params, (err, data) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(data);
      }
    });
  });
}

async function remove(id) {}

async function countByAthelete(id) {}

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

const makeBatchDeleteParams = (ids) => {
  var params = { RequestItems: {} };
  params.RequestItems[TableName] = []
  ids.forEach(id => {
    const newItem =  { DeleteRequest: {Key: { id },}};
    params.RequestItems[TableName].push(newItem)
  });
  return params;
};


