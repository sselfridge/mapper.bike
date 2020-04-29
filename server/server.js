const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fs = require("fs");

// DB code, might use in the future
// const mongoose = require("mongoose");
// const mongoURI = "mongodb://localhost/meinmap";
// mongoose.connect(mongoURI, { useNewUrlParser: true });

const oAuthStrava = require("./controllers/oAuthStrava");
const stravaController = require("./controllers/stravaController");
const analyticController = require("./controllers/analyticsController");

const zip = require("../config/zip_lat_lang");

const config = require("../config/keys");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(analyticController.getUserData);
app.use(logReq);

app.get("/api/getStravaUser", oAuthStrava.loadStravaProfile, (req, res) => {
  if (res.locals.err) {
    res.status(444).send("Error during profile fetch");
    return;
  }
  if (res.locals.user) {
    //user profile exists send infoback
    console.log(`User logged in to strava`);
    res.send(JSON.stringify(res.locals.user));
    return;
  }
  //no user logged in
  console.log(`User not logged in to strava`);
  res.status(201).send("User Not logged in");
});

//This route has been deprecated, keeping it around for a bit in case the
// new issue has bugs popup
app.get("/api/getLatLngZip/:zip", (req, res) => {
  if (!/^\d{5}/.test(req.params.zip)) {
    res.status(400).send("Only 5 digit zipcodes allowed");
    return;
  } //only query if zip is 5 numbers
  const latlng = zip(req.params.zip);
  if (latlng === null) {
    res.status(400).send(`Invalid zipcode: ${req.params.zip}`);
    return;
  }
  const center = {
    lat: latlng[0],
    lng: latlng[1],
  };
  res.json(center);
});

app.get("/api/strava/callback", oAuthStrava.setStravaOauth, (req, res) => {
  console.log(`Strava CallBack Happening`);
  if (res.locals.err) {
    console.log(res.locals.err);
    res.status(523).send("Error with Oauth");
  }
  res.redirect(config.redirect_url);
});

app.get(
  "/api/getActivities",
  oAuthStrava.loadStravaProfile,
  stravaController.getActivities,
  (req, res) => {
    if (res.locals.err) {
      console.log(res.locals.err);
      res.status(523).send("Error with get Activities");
      return;
    }
    console.log(`Sending Back ${res.locals.activities.length} activities`);
    res.send(JSON.stringify(res.locals.activities));
  }
);

app.get(
  "/api/getActivityDetail",
  oAuthStrava.loadStravaProfile,
  stravaController.getActivityDetail,
  (req, res) => {
    console.log("fin");
    res.send(res.locals.activities);
  }
);

app.get(
  "/api/segments",
  oAuthStrava.loadStravaProfile,
  stravaController.getSegments,
  (req, res) => {
    if (res.locals.err) {
      console.log(res.locals.err);
      res.status(523).send("Error with get segments ");
      return;
    }
    if (res.locals.pending) {
      res.status(203).send("Data Pending, checkback soon");
      return;
    }

    res.send(JSON.stringify(res.locals.segments));
  }
);

app.get("/api/getDemoData", stravaController.getDemoData, (req, res) => {
  console.log(`Sending Back ${res.locals.activities.length} activities`);
  res.send(JSON.stringify(res.locals.activities));
});

app.get("/api/logout", stravaController.clearCookie, (req, res) => {
  res.send("Ok");
});

// statically serve everything in the build folder on the route '/build'
if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test") {
  console.log(`Server in Production mode!`);
  app.use("/build", express.static(path.join(__dirname, "../build")));
  // serve index.html on the route '/'
  app.get("/", (req, res) => {
    console.log("Sending out the index");
    res.sendFile(path.join(__dirname, "../index.html"));
  });

  // TODO: redo this to bundle image in webpack
  app.get("/client/img/:image", (req, res) => {
    const imagePath = path.join(__dirname, `../client/img/${req.params.image}`);
    fs.exists(imagePath, function (exists) {
      if (exists) {
        res.sendFile(imagePath);
      } else {
        res.status(404).send("404");
      }
    });
  });
}

app.use("*", (req, res) => {
  console.log("ERROR Catch All -- Req Url:", req.url);
  // prettier-ignore
  if(req.url === "/") console.log("NODE_ENV must be 'production' Current:", process.env.NODE_ENV)
  res.status(404).send("404 - that did not go well");
});

app.use((err, req, res, next) => {
  console.log(`Catch All Error:======================================`);
  if (err.code != 11000) console.log(err); //11000 is a mongoDB error
  res.status(500).send("Something Broke, we're sorry");
  next();
});

function logReq(req, res, next) {
  console.log(req.url);
  next();
}

module.exports = app;
