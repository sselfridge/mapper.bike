const fs = require("fs");
const decodePolyline = require("decode-google-map-polyline");

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

  // take polyline and decode into GPS points to be placed on map in polyline component
  // ya I know its weird but here we are
  decodePoly: (activities) => {
    activities.forEach((activity) => {
      try {
        const decodedPath = decodePolyline(activity.line);
        activity.points = decodedPath;
        //get mid point of activity for centering map
        //TODO: This would be better by getting the 4 extremes and using them
        const midPoint = decodedPath[Math.floor(decodedPath.length / 2)];
        activity.midLatLng = [midPoint.lat, midPoint.lng];
      } catch (error) {
        console.log(`Error decoding activity: ${activity.name}`);
      }
    });

    return activities;
  },
};
