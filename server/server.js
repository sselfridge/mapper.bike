const express = require("express");
const app = express();
const path = require("path");
global._stravaAPI = require("./utils/stravaClient");

const cookieParser = require("cookie-parser");
const fs = require("fs");

const oAuthStrava = require("./controllers/oAuthStrava");
const summaryController = require("./controllers/summaryStrava");
const segmentController = require("./controllers/segmentsController");
const userController = require("./controllers/userController");
const analyticsController = require("./controllers/analyticsController");

const stravaQ = require("./services/stravaQueue");
const zip = require("../src/config/zip_lat_lang");
const config = require("../src/config/keys");

// app.use(bodyParser.json()); // for parsing application/json
// app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.json({ extended: false }));

app.use(cookieParser());

app.use(logReq);

// const awsTest = require("../awsTest");

// REMINDER: Nodemon doesn't pickup new routes, need to kill and restart everything when changing routes

var cron = require("node-cron");

//Every morning at 04:01 am
cron.schedule("01 04 * * *", () => {});

// Every 15min
// cron.schedule("*/15 * * * *", () => {
//   if (process.env.NODE_ENV === "production") {
//     console.log("---- 15 min Cron----");
//     stravaQ.processQueue();
//   }
// });

app.get("/api/getStravaUser", oAuthStrava.loadStravaProfile, (req, res) => {
  //TODO - rework error handling
  // Currently no difference between actual errors and no cookie found.
  // if (res.locals.err) {
  //   res.status(444).send("Error during profile fetch");
  //   return;
  // }
  if (res.locals.user) {
    //user profile exists send info back
    console.log(`User logged in to strava`);
    res.send(JSON.stringify(res.locals.user));
    return;
  }
  if (res.locals.err) {
    res.sendStatus(200);
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
    res.status(400).send("Only 5 digit zip codes allowed");
    return;
  } //only query if zip is 5 numbers
  const latlng = zip(req.params.zip);
  if (latlng === null) {
    res.status(400).send(`Invalid zip code: ${req.params.zip}`);
    return;
  }
  const center = {
    lat: latlng[0],
    lng: latlng[1],
  };
  res.json(center);
});

app.get("/api/strava/callback", oAuthStrava.setStravaOauth, (req, res) => {
  console.log(`Strava Oauth CallBack Happening`);
  if (res.locals.err) {
    console.log(res.locals.err);
    res.status(523).send("Error with Oauth");
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
    // uncomment to save activities to file
    // fs.writeFileSync("./savedActivities.json", JSON.stringify(res.locals.activities));
    res.send(JSON.stringify(res.locals.activities));
  }
);

app.get("/api/demoData", (req, res) => {
  const demoData = fs.readFileSync("./server/utils/LGGroupRides.json");
  res.send(demoData);
});

app.get(
  "/api/test",
  oAuthStrava.loadStravaProfile,
  oAuthStrava.adminOnly,
  segmentController.test,
  (req, res) => {
    if (res.locals.err) {
      console.log("Error!!");
      console.log(res.locals.err);
      res.status(500).send("DOH!!");
    } else {
      console.log("fin");
      res.send("OK");
    }
  }
);
app.get(
  "/api/test/reset",
  oAuthStrava.loadStravaProfile,
  oAuthStrava.adminOnly,
  segmentController.testReset,
  (req, res) => {
    if (res.locals.err) {
      console.log("Reset Error!!");
      console.log(res.locals.err);
      res.status(500).send("DOH!!");
    } else {
      console.log("Reset Complete");
      res.send("OK");
    }
  }
);

/*

end points for setting up strava push notifications

app.get("/api/testHook", (req, res) => {
  console.log("  client_id: config.client_id,: ", config.client_id);
  console.log(" config.client_secret,: ", config.client_secret);

  const URL = "https://www.strava.com/api/v3/push_subscriptions";
  console.log("Make test-hook req");
  axios
    .post(URL, {
      client_id: config.client_id,
      client_secret: config.client_secret,
      callback_url: "http://www.mapper.bike/api/getHook",
      verify_token: config.secretSuperKey,
    })
    .then((result) => {
      return res.send("GOGO").status(200);
    })
    .catch((err) => {
      console.log("API: Error");
      console.log(err.toJSON().message);
      return res.send("no good...").status(500);
    });

  // res.status(200);
});

app.get("/api/getHook", (req, res) => {
  const challenge = req.query["hub.challenge"];
  console.log("req  ", challenge);

  res.send({ "hub.challenge": challenge });
});
*/

app.post("/api/testPost", (req, res) => {
  const out = req.body;
  console.log("out: ", out);

  res.send(out);
});

app.post(
  "/api/getHook",
  segmentController.parsePushNotification,
  (req, res) => {
    // { aspect_type: 'create',
    // event_time: 1634501165,
    // object_id: 6128714606,
    // object_type: 'activity',
    // owner_id: 1075670,
    // subscription_id: 123456,
    // updates: {} }
    if (res.locals.err) {
      //no need to bug strava with my problems...
      res.sendStatus(200);
      return;
    }

    const SUB_LOG = "logs/subs.txt";
    fs.appendFileSync(SUB_LOG, `${JSON.stringify(req.body)}\n`);

    res.sendStatus(200);
  }
);

app.post(
  "/api/initialize",
  oAuthStrava.loadStravaProfile,
  userController.initializeUser,
  (req, res) => {
    if (res.locals.err) {
      console.log(res.locals.err);
      res.status(501).send("Error initializing user ");
      return;
    }
    const count = res.locals.data.activityCount;

    res.send(JSON.stringify(count));
  }
);

app.get(
  "/api/segmentEfforts",
  oAuthStrava.loadStravaProfile,
  segmentController.segmentEfforts,
  (req, res) => {
    console.log("finalize Segment Efforts");
    if (res.locals.err) {
      console.log(res.locals.err);
      res.status(523).send("Error with get Efforts ");
      return;
    }
    if (res.locals.pending) {
      res.status(203).send("Data Pending, check back soon");
      return;
    }
    // fs.writeFileSync("./savedEfforts.json", JSON.stringify(res.locals.segmentEfforts));

    res.send(JSON.stringify(res.locals.segmentEfforts));
  }
);

app.get(
  "/api/refreshLeaderboard",
  oAuthStrava.loadStravaProfile,
  segmentController.getLeaderboard,
  (req, res) => {
    if (res.locals.err) {
      res.status(523).send("Error with refresh leaderboard ");
      return;
    }

    res.send(res.locals.data);
  }
);

app.get("/api/getDemoData", summaryController.getDemoData, (req, res) => {
  console.log(`Sending Back ${res.locals.activities.length} activities`);
  res.send(JSON.stringify(res.locals.activities));
});

app.post("/api/logout", oAuthStrava.clearCookie, (req, res) => {
  res.send("Ok");
});

app.get("/api/users/:id", userController.getUser, (req, res) => {
  if (res.locals.err) {
    res.status(512).send("Error Fetching User");
    return;
  }

  if (res.locals.user) {
    res.send(JSON.stringify(res.locals.user));
  } else {
    res.status(204).send();
  }
});

app.get("/api/kickoffQ", (req, res) => {
  console.log("endPoint /api/kickoffQ hit, starting Q");
  stravaQ.processQueue();
  res.send("ok");
});

app.delete(
  "/api/users/:id",
  oAuthStrava.loadStravaProfile,
  userController.deleteUser,
  (req, res) => {
    if (res.locals.err) {
      res.status(500).send();
      return;
    }

    res.send("Done");
  }
);

app.get("/api/sbmt/submission/:password/", (req, res) => {
  console.info(" req.query : ", req.params);
  const { password } = req.params;
  if (password !== config.sbmtPassword) {
    console.info("sbmt password failed:", password);
    res.sendStatus(403);
  }

  const allowed = /[^A-Z0-9:?&/=.@ \n]/gi;

  if (req.query.segment && typeof req.query.segment === "string") {
    const value = req.query.segment;
    const clean = value.replace(allowed, "");
    fs.appendFileSync("logs/sbmt.txt", `${JSON.stringify(clean)},\n`);
  }

  res.send();
});

// statically serve everything in the build folder on the route '/build'
if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test") {
  console.log(
    `Server in Production/Test mode!`,
    path.join(__dirname, "../build")
  );
  app.use("/build", express.static(path.join(__dirname, "../build")));
  app.use("/static", express.static(path.join(__dirname, "../build/static")));
  // serve index.html on the route '/'
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
  if (err.code !== 11000) console.log(err); //11000 is a mongoDB error
  res.status(500).send("Something Broke, we're sorry");
  next();
});

function logReq(req, res, next) {
  console.log(req.url);
  next();
}

module.exports = app;
