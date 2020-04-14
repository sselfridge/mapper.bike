const fs = require("fs");
var stravaAPI = require("strava-v3");

const config = require("../../config/keys");

stravaAPI.config({
  // "access_token"  : "Your apps access token (Required for Quickstart)",
  client_id: config.client_id,
  client_secret: config.client_secret,
  redirect_uri: config.redirect_uri,
});

const USERLOGFILE = "logs/users.txt";

module.exports = {
  logUser: (firstname, lastname) => {
    let str = firstname + " " + lastname;
    if (str.length > 30) {
      str = str.substring(0, 30);
    } else {
      while (str.length < 30) str = str + " ";
    }
    let date = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
    str += date + "-PST \n";
    fs.appendFileSync(USERLOGFILE, str);
  },
  addMidPoint: (activity) => {
    //TODO: This would be better by getting the 4 extremes and using them
    const midPoint = activity.points[Math.floor(activity.points.length / 2)];
    activity.midLatLng = [midPoint.lat, midPoint.lng];
  },
  // takes a string that represnts a date and returns the epoch time in seconds
  // "2012-02-15T21:20:29Z" --> 1329340829
  makeEpochSecondsTime: (timeString) => {
    const date = new Date(timeString);
    return Math.floor(date.getTime() / 1000);
  },
};
