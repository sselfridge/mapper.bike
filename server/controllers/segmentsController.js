//Models
// const db = require("../models/db/dataLayer");
const User = require("../models/User");
const Effort = require("../models/Effort");
const Activity = require("../models/Activity");
const Segment = require("../models/Segment");

const dayjs = require("../utils/dayjs");
const config = require("../../src/config/keys");

const got = require("got");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// eslint-disable-next-line require-await
async function segmentEfforts(req, res, next) {
  const athleteId = res.locals.user.athleteId;
  const rank = parseInt(req.query.rank ? req.query.rank : 1);

  Effort.getEffortsWithPath(athleteId, rank)
    .then((efforts) => {
      console.log(`Got ${efforts.length} efforts with details`);
      res.locals.segmentEfforts = efforts;
      next();
    })
    .catch((err) => {
      res.locals.err = err;
      next();
    });
}

//TODO - update db structure to combine efforts?
// async function updateEffort(req, res, next) {
//   // params: activityId, segmentId
//   //pull effort from DB
//   //get current ranks
//   //if different
//   /*  update rank
//    */
//   //  update updated
// }

async function parsePushNotification(req, res, next) {
  console.log("parsePush");

  const update = req.body;

  const {
    owner_id: athleteId,
    aspect_type: aspectType,
    object_id: activityId,
    subscription_id: subscriptionId,
  } = update;

  if (athleteId === 4973582) {
    res.locals.err = "Damn Daniele";
    //this 1 dude is half my sub-updates and he never has any ride info.
    return next();
  }

  const userIds = await getUserIds();
  //Validate Request
  if (
    !athleteId ||
    !aspectType ||
    !subscriptionId ||
    !activityId ||
    !userIds.includes(update.owner_id) || //user sign up for KOM mapper
    aspectType !== "create" || //grab initial creation
    subscriptionId !== config.subscriptionId //weak validation
  ) {
    console.log("push validation failed");

    return next();
  }

  console.log("Add to Q:", activityId, athleteId);
  await Activity.add(activityId, athleteId);

  return next();
}

let lastFetchTime = null;
let userList = [];

async function getUserIds() {
  const now = dayjs();

  if (!lastFetchTime || now.diff(lastFetchTime, "seconds") > 30) {
    const dbUsers = await User.getAll();
    lastFetchTime = now;
    userList = dbUsers.map((u) => u.id);
  }

  return userList;
}

// eslint-disable-next-line require-await
async function test(req, res, next) {
  console.log("Start Test");
  // const strava = res.locals.strava;

  // const stravaSub = require("strava-v3");

  // stravaSub.config({
  //   client_id: config.client_id,
  //   client_secret: config.client_secret,
  // });

  var stravaAPI = require("strava-v3");
  stravaAPI.config({
    // "access_token"  : "Your apps access token (Required for Quickstart)",
    client_id: config.client_id,
    client_secret: config.client_secret,
    redirect_uri: config.redirect_uri,
  });

  // const testStrava = new stravaAPI.client(
  //   "e062bcd7de8fd1dd736071dbf45dc7f281b1ec0e"
  // );

  try {
    //   stravaSub.pushSubscriptions
    //     .list()
    //     // .create({
    //     //   callback_url: "http://9d6b-184-187-181-40.ngrok.io/api/gethook",
    //     //   verify_token: "",
    //     // })
    //     // .delete({
    //     //   id: 203074,
    //     // })
    //     .then((res) => {
    //       console.log("res: ", res);

    //       console.log("prom Done");
    //       next();
    //     })
    //     .catch((err) => {
    //       console.log(err.error.message);
    //       console.log(err.error.errors);
    //       console.log("sub Error");
    //       next();
    //     });
    //   return;
    // const result = await strava.segments.listLeaderboard({ id: 8058447 });
    // const { updateAllUserSinceLast } = require("../services/effortsServices");
    // const result = await updateAllUserSinceLast();
    const result = await User.getFullSegment(6930112);
    // const result = await testStrava.athlete.listActivities({});
    // const result = await db.batchDeleteAllDetails();
    // const result = await db.getEffort("19676752-2019-08-17T16:13:29Z");
    // console.log("get Ranks");
    // const result = await getLeaderboard(651706);
    // const result = await getLeaderboard(651706);
    // const result await db.
    // const result = await strava.segments.listEfforts({ id: 30179277, per_page: 200 });
    // const result = await strava.activities.get({
    //   id: 6184921496,
    //   include_all_efforts: true,
    // });
    // const result = await strava.segments.get({ id: 16616440 });
    // const result = await db.deleteUser(1075670);
    // const result = await strava.activities.get({ id: 3462588758 });
    console.info("test result ----");
    console.log(result);
    console.info("---- end test result");
    // result.forEach((effort) => {
    //   console.log(effort.moving_time);
    //   console.log(effort.elapsed_time);
    //   console.log("------------------");
    // });
    console.log("Done! Did this still work?");
  } catch (err) {
    console.log("CRAP!!!");
    console.log(err.message);
    res.locals.err = "AAAAAAAAA";
  }

  console.log("Test Done");
  next();
}

async function testReset(req, res, next) {
  if (process.env.NODE_ENV === "production") {
    console.error(
      "Cannot run this in production.  If you really want to, do a special push for it"
    );
    res.locals.err = "Not allowed on Prod";
    res.status(403);
    return next();
  }
  console.log("Reset Test data");

  let result;
  try {
    result = await Effort.deleteAll();
    console.log("result: ", result);
    result = await Segment.deleteAll();
    console.log("result: ", result);

    result = await Activity.deleteAll();
    console.log("result: ", result);

    console.info("Done Reset");
  } catch (err) {
    console.log("Reset error");
    console.log(err.message);
    res.locals.err = "AAAAAAAAA";
  }
  return next();
}

async function getLeaderboard(segmentId) {
  const response = await got(`https://www.strava.com/segments/${segmentId}`);

  if (response.statusCode !== 200) {
    throw new Error("HTML req error - found code:", response.statusCode);
  }

  const dom = new JSDOM(response.body);

  // Create an Array out of the HTML Elements for filtering using spread syntax.
  const nodeList = [
    ...dom.window.document.querySelectorAll("table.table-leaderboard"),
  ];

  //TODO - verify leaderboard
  const table = nodeList[0];

  const rows = table.querySelectorAll("tbody > tr");

  const ranks = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowObj = {};

    for (const key in ROW_MAP) {
      if (Object.hasOwnProperty.call(ROW_MAP, key)) {
        const selArr = ROW_MAP[key];
        rowObj[key] = getFromRow(row, selArr);
        rowObj.row = i + 1;
      }
    }
    rowObj.segmentId = rowObj.link.replace(/\D/g, "");
    ranks.push(rowObj);
  }

  return ranks;
}

const ROW_MAP = {
  place: ["td:nth-child(1)"],
  name: ["td:nth-child(2)"],
  time: ["td > a"],
  link: ["td > a", "href"],
};

const getFromRow = (row, selArr) => {
  const selector = selArr[0];
  const attribute = selArr[1] ? selArr[1] : "innerHTML";

  const elm = row.querySelector(selector);
  const value = elm[attribute];

  return value;
};

module.exports = {
  test,
  testReset,
  segmentEfforts,
  parsePushNotification,
};
