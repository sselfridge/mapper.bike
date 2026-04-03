require("dotenv").config();
const app = require("./server");

//split off the listen() function so the server can be loaded for testing
const env = process.env.NODE_ENV;

const ip = env === "production" || env === "test" ? 8080 : 3000;

var http = require("http");

var httpServer = http.createServer(app);
httpServer.listen(ip);
console.log(`Listening on Port ${ip}`);
