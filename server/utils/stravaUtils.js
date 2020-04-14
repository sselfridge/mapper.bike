const fs = require("fs");
const m = require('moment')
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
  
//check if the accesstoken is expired, if so request a new one
 checkAndRefreshStravaClient:(res) => {
  return new Promise((resolve, reject) => {
    const expires_at = res.locals.expires_at;
    console.log(`Token Expires at ${expires_at.format("hh:mm A")},`, expires_at.fromNow());
    console.log("Refresh Token", res.locals.refreshToken);
    if (m().isAfter(expires_at)) {
      console.log("Token Expired, refreshing");

      stravaAPI.oauth
        .refreshToken(res.locals.refreshToken)
        .then((result) => {
          let payload = {
            expires_at: result.expires_at,
            refreshToken: result.refreshToken,
            accessToken: result.accessToken,
            athleteID: res.locals.athleteID,
          };
          setJWTCookie(res, payload);
          res.locals.expires_at = result.expires_at;
          res.locals.accessToken = result.access_token;
          res.locals.strava = new stravaAPI.client(result.accessToken);
          return resolve();
        })
        .catch((err) => {
          console.log("Error During Token Refresh");
          console.log(err);
          reject("Error During Token Refresh");
        });
    } else {
      console.log("Token Not Expired");
      return resolve();
    }
  });
}

};




