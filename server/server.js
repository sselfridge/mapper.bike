const express = require("express");
const app = express();
const path = require("path");
global._stravaAPI = require("./utils/stravaClient");

const cookieParser = require("cookie-parser");
const fs = require("fs");

const oAuthStrava = require("./controllers/oAuthStrava");
const summaryController = require("./controllers/summaryStrava");
const analyticsController = require("./controllers/analyticsController");

const config = require("../src/config/keys");

app.use(express.json({ extended: false }));
app.use(cookieParser());
app.use(logReq);
app.use((req, res, next) => {
  if (req.hostname === "mapper.bike") {
    return res.redirect(301, `https://www.mapperbike.com${req.originalUrl}`);
  }
  next();
});

app.get("/api/getStravaUser", oAuthStrava.loadStravaProfile, (req, res) => {
  if (res.locals.user) {
    console.log(`User logged in to strava`);
    res.send(JSON.stringify(res.locals.user));
    return;
  }
  if (res.locals.err) {
    res.sendStatus(200);
    return;
  }
  console.log(`User not logged in to strava`);
  res.status(201).send("User Not logged in");
});

app.get("/api/strava/callback", oAuthStrava.setStravaOauth, (req, res) => {
  console.log(`Strava Oauth CallBack Happening`);
  if (res.locals.err) {
    console.log(res.locals.err);
    res.status(523).send("Error with Oauth");
    return;
  }
  res.redirect(config.redirect_url);
});

app.get(
  "/api/summaryActivities",
  oAuthStrava.loadStravaProfile,
  summaryController.getSummaries,
  (req, res) => {
    if (res.locals.err) {
      console.log(res.locals.err);
      res.status(523).send("Error with get Activities");
      return;
    }
    console.log(`Sending Back ${res.locals.activities.length} activities`);
    res.send(JSON.stringify(res.locals.activities));
  },
);

app.get("/api/demoData", (req, res) => {
  const demoData = fs.readFileSync("./server/utils/LGGroupRides.json");
  res.send(demoData);
});

app.get("/api/getDemoData", summaryController.getDemoData, (req, res) => {
  console.log(`Sending Back ${res.locals.activities.length} activities`);
  res.send(JSON.stringify(res.locals.activities));
});

app.post("/api/logout", oAuthStrava.clearCookie, (req, res) => {
  res.send("Ok");
});

// statically serve everything in the build folder on the route '/build'
if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test") {
  console.log(
    `Server in Production/Test mode!`,
    path.join(__dirname, "../build"),
  );
  app.use("/build", express.static(path.join(__dirname, "../build")));
  app.use("/static", express.static(path.join(__dirname, "../build/static")));
  app.get("/", analyticsController.logUserData, (req, res) => {
    console.log("Sending out the index");
    if (fs.existsSync(path.join(__dirname, "../public/maintenance.html"))) {
      res.sendFile(path.join(__dirname, "../public/maintenance.html"));
      return;
    }
    res.sendFile(path.join(__dirname, "../build/index.html"));
  });

  app.get("/img/:image", (req, res) => {
    const imagePath = path.join(__dirname, `../build/img/${req.params.image}`);
    if (fs.existsSync(imagePath)) {
      res.sendFile(imagePath);
    } else {
      res.status(404).send("404");
    }
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
  console.log(err);
  res.status(500).send("Something Broke, we're sorry");
  next();
});

function logReq(req, res, next) {
  console.log(req.url);
  next();
}

module.exports = app;
