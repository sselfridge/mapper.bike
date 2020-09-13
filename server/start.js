const app = require("./server");

//split off the listen() function so the server can be loaded for testing
const env = process.env.NODE_ENV;

const ip = env === "production" ? 8080 : 3000;

app.listen(ip);
console.log(`Listening on Port ${ip}`);
