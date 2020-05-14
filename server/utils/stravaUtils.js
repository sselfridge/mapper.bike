const fs = require("fs");

const USERLOGFILE = "logs/users.txt";

const utils = {
  logUser,
  addMidPoint,
  makeEpochSecondsTime,
};

function logUser(firstname, lastname) {
  let str = firstname + " " + lastname;
  if (str.length > 30) {
    str = str.substring(0, 30);
  } else {
    while (str.length < 30) str = str + " ";
  }
  let date = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
  str += date + "-PST \n";
  fs.appendFileSync(USERLOGFILE, str);
}

function addMidPoint(activity) {
  //TODO: This would be better by getting the 4 extremes and using them
  const midPoint = activity.points[Math.floor(activity.points.length / 2)];
  activity.midLatLng = [midPoint.lat, midPoint.lng];
}
// takes a string that represnts a date and returns the epoch time in seconds
// "2012-02-15T21:20:29Z" --> 1329340829
function makeEpochSecondsTime(timeString) {
  const date = new Date(timeString);
  return Math.floor(date.getTime() / 1000);
}

module.exports = utils;
