const app = require("./server");

//split off the listen() function so the server can be loaded for testing
const env = process.env.NODE_ENV;

const ip = env === "production" || env === "test" ? 8080 : 3000;

var fs = require("fs");
var http = require("http");

if (env === "production") {
  var https = require("https");
  var privateKey = fs.readFileSync("./privkey.pem", "utf8");
  var certificate = fs.readFileSync("./fullchain.pem", "utf8");
  var credentials = { key: privateKey, cert: certificate };
  var httpsServer = https.createServer(credentials, app);
  httpsServer.listen(8443);
  console.log(`Listening on Port 8443`);
}
var httpServer = http.createServer(app);
httpServer.listen(ip);
console.log(`Listening on Port ${ip}`);
