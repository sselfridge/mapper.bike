const fs = require("fs");

const analyticsController = {};
analyticsController.getUserData = getUserData;

function getUserData(req, res, next) {
  fs.appendFileSync("logs/analytics.txt", `${req.headers["user-agent"]} - ${new Date().toLocaleString()}\n`);
  next();
}

module.exports = analyticsController;
