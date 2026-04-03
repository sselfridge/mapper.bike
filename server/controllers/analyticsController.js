const fs = require("fs");

const analyticsController = {
  logUserData,
};

function logUserData(req, res, next) {
  if (!fs.existsSync("logs")) fs.mkdirSync("logs");
  if (!fs.existsSync("logs/analytics.txt")) fs.writeFileSync("logs/analytics.txt", "");
  fs.appendFileSync(
    "logs/analytics.txt",
    `${req.headers["user-agent"]} - ${new Date().toLocaleString()}\n`,
  );
  next();
}

module.exports = analyticsController;
