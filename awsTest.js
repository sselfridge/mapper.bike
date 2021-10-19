var AWS = require("aws-sdk");
const moment = require("./node_modules/moment/moment");

//aws creds stored in ~/.aws/credentials
var credentials = new AWS.SharedIniFileCredentials({ profile: "dbuser" });
AWS.config.credentials = credentials;
AWS.config.update({ region: "us-west-2" });

// var db = new AWS.DynamoDB();
var client = new AWS.DynamoDB.DocumentClient();
var params;

//  params = {
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

// db.createTable(params, function(err, data) {
//     if (err) {
//         console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
//     } else {
//         console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
//     }
// });

// params = {
//   TableName: 'activities',
//   Item: {
//     'id' : 3221234456,
//     'athleteId' : 14231234456,
//   }
// };

// // Call DynamoDB to add the item to the table
// client.put(params, function(err, data) {
//   if (err) {
//     console.log("Error", err);
//   } else {
//     console.log("Success", data);
//   }
// });

// params = {
//   TableName: "users",
//   Key: {
//     id: 123456
//   },
//   UpdateExpression: 'set #a = :a, #r = :r',
//   ExpressionAttributeNames: {'#a' : 'accessToken', '#r': 'refreshToken'},
//   ExpressionAttributeValues: {
//     ':a' : 'asdf',
//     ':r' : 'qwer',
//   }
// };

// client.update(params, (err, data) => {
//   if (err) {
//     console.log("Error", err);
//   } else {
//     console.log("Success", data);
//   }
// });

// params = {
//   TableName: "activities",
//   Limit: 10,
// };

// client.scan(params, (err, data) => {
//   if (err) {
//     console.log("Error", err);
//   } else {
//     console.log("Success", data);
//   }
// });
// params = {
//   Key: {
//     id: 3244434795,
//   },
//   TableName: "activities",
// };

// client.get(params, (err, data) => {
//   if (err) {
//     console.log("Error", err);
//   } else {
//     console.log("Success", data);
//   }
// });

// params = {
//   TableName: 'activities',
//   Item: {
//     'id' : {N: '322456'},
//     'athleteId' : {N: '1423456'},
//   }
// };

// // Call DynamoDB to add the item to the table
// db.putItem(params, function(err, data) {
//   if (err) {
//     console.log("Error", err);
//   } else {
//     console.log("Success", data);
//   }
// });

//  params = {
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

//    db.scan(params, function(err, data) {
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

// db.query(params, (err, data) => {
//   if (err) {
//     console.log(err);
//   }
//   else
//   console.log(data);
// });

//  params = {
//   TableName: "TestSegments",
//   Select: "ALL_ATTRIBUTES",
// };
// db.scan(params, (err, data) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log((flatten(data)))
// });

//  params = {
//   TableName : 'users',
//   Key: {
//     id: 123456,
//   }
// };

// client.delete(params, function(err, data) {
//   if (err) console.log(err);
//   else console.log(data);
// });

// bulk update
// const details = [{ id: 12345 }, { id: 987654321 }];
// const detailsMore = [
//   { id: 12345, path: "ThisPath" },
//   { id: 987654321, path: "ThisPath" },
// ];
// const lastDetails = [{ id: 12345 }, { id: 987654321 }];

// const data = { id: 1234 };

// const { id, path } = data;

// params = {
//   TableName: "segmentDetails",
//   Key: { id },
// };

// if (path) {
//   params.UpdateExpression = "set #a = :a";
//     (params.ExpressionAttributeNames = { "#a": "path" });
//     (params.ExpressionAttributeValues = {
//       ":a": path,
//     });
// }

// client.update(params, (err, data) => {
//   if (err) {
//     console.log("DB Error", err);
//   } else {
//     console.log("Success");
//     console.log(data);
//   }
// });

// params = {
//   TableName: "segmentRanks",
//   IndexName: "athleteId-rank-index",
//   KeyConditionExpression: "athleteId = :a AND #rank <= :r",
//   ExpressionAttributeNames: { "#rank": "rank" },
//   ExpressionAttributeValues: {
//     ":a": 1075670,
//     ":r": 2
//   },
// };

// client.query(params, (err, data) => {
//   if (err) {
//     console.log("DB Error", err);
//   } else {
//     console.log("Success");
//     console.log(data);
//   }
// });

params = {
  Key: {
    id: "19676752-2019-08-17T16:13:29Z",
  },
  TableName: "segmentEfforts-dev",
};

client.get(params, (err, data) => {
  if (err) {
    console.log("get Segment Details Error", err);
    // reject(err);
  } else {
    console.log("output");
    console.log(data);
    console.log(1234567);
  }
});

params = {
  Key: {
    id: "19676752-2019-08-17T16:13:29Z",
  },
  TableName: "segmentEfforts-dev",
  // AttributeUpdates: {
  //   initialrank: {
  //     Action: "DELETE",
  //   },
  // },
  ReturnValues: "ALL_OLD",
  UpdateExpression: "set #r = :r",
  ExpressionAttributeNames: { "#r": "updated" },
  ExpressionAttributeValues: {
    ":r": "987654987",
  },
};

client.update(params, (err, data) => {
  if (err) {
    console.log("get Segment Details Error", err);
    // reject(err);
  } else {
    console.log("456654");
    console.log(data);
 
  }
});
