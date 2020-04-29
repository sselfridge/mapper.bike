var AWS = require("aws-sdk");

//aws creds stored in ~/.aws/credentials
var credentials = new AWS.SharedIniFileCredentials({ profile: "dbuser" });
AWS.config.credentials = credentials;
AWS.config.update({ region: "us-west-2" });

var db = new AWS.DynamoDB();
var params;
// var params = {
//     TableName : "TestActivities",
//     KeySchema: [
//         { AttributeName: "id", KeyType: "HASH"},  //Partition key
//         { AttributeName: "date", KeyType: "RANGE" }  //Sort key
//     ],
//     AttributeDefinitions: [
//         { AttributeName: "id", AttributeType: "N" },
//         { AttributeName: "date", AttributeType: "N" },

//     ],
//     BillingMode: "PAY_PER_REQUEST"
// };

// dynamodb.createTable(params, function(err, data) {
//     if (err) {
//         console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
//     } else {
//         console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
//     }
// });

// var params = {
//   TableName: 'TestActivities',
//   Item: {
//     'id' : {N: '322456'},
//     'athleteId' : {S: 'ID:1423456'},
//     'path' : {S: "23456789876543234567898765432345678987654345678"}
//   }
// };

// // Call DynamoDB to add the item to the table
// dynamodb.putItem(params, function(err, data) {
//   if (err) {
//     console.log("Error", err);
//   } else {
//     console.log("Success", data);
//   }
// });

// var params = {
//     // ExpressionAttributeNames: {
//     //  "#ID": "id",
//     //  "#AI": "athleteId",
//     //  "#PA": "path"
//     // },
//     // ExpressionAttributeValues: {
//     //  ":a": {
//     //    S: "No One You Know"
//     //   }
//     // },
//     // FilterExpression: "Artist = :a",
//     TableName: "TestActivities",
//     ScanFilter: {
//         'name': {
//           ComparisonOperator: 'NULL'
//         }
//     },
//     Select: 'ALL_ATTRIBUTES'
//    }

//    dynamodb.scan(params, function(err, data) {
//      if (err) console.log(err, err.stack); // an error occurred
//      else    { console.log(data); console.log(data.Items);}

//    });

// params = {
//   TableName: "TestActivities",
//   IndexName: "kind-index",
//   KeyConditionExpression: "kind = :kind",
//   ExpressionAttributeValues: {
//     ":kind": {S: "summary"},
//   },
//   // ProjectionExpression: "ALL",
// };

// dynamodb.query(params, (err, data) => {
//   if (err) {
//     console.log(err);
//   }
//   else
//   console.log(data);
// });

 params = {
  TableName: "TestSegments",
  Select: "ALL_ATTRIBUTES",
};
db.scan(params, (err, data) => {
  if (err) {
    console.log(err);
  }
  console.log((flatten(data)))
});

var descriptors = ['L', 'M', 'N', 'S'];

function flatten(o) {

  // flattens single property objects that have descriptors  
  for (let d of descriptors) {
    if (o.hasOwnProperty(d)) {
      return o[d];
    }
  }

  Object.keys(o).forEach((k) => {

    for (let d of descriptors) {
      if (o[k].hasOwnProperty(d)) {
        o[k] = o[k][d];
      }
    }
    if (Array.isArray(o[k])) {
      o[k] = o[k].map(e => flatten(e))
    } else if (typeof o[k] === 'object') {
      o[k] = flatten(o[k])
    }
  });

  return o;
}