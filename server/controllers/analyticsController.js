const fs = require("fs");

const analyticsController = {
  logUserData,
};

function logUserData(req, res, next) {
  fs.appendFileSync(
    "logs/analytics.txt",
    `${req.headers["user-agent"]} - ${new Date().toLocaleString()}\n`
  );
  next();
}

module.exports = analyticsController;
