var AWS = require("aws-sdk");

//aws creds stored in ~/.aws/credentials
var credentials = new AWS.SharedIniFileCredentials({ profile: "dbuser" });
AWS.config.credentials = credentials;
AWS.config.update({ region: "us-west-2" });

var db = new AWS.DynamoDB.DocumentClient();

module.exports = db;