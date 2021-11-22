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

const stravaQ = require("../services/stravaQueue");

// eslint-disable-next-line require-await
async function segmentEfforts(req, res, next) {
  const rank = parseInt(req.query.rank ? req.query.rank : 1);

  Effort.getEffortsWithPath(res.locals.user, rank)
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
  console.log("parsePushNotification");
  console.info("req.url: ", req.url);
  console.info("req.body: ", req.body);

  const {
    owner_id: athleteId,
    aspect_type: aspectType,
    object_id: activityId,
    // eslint-disable-next-line no-unused-vars
    subscription_id: subscriptionId,
  } = req.body;

  if (athleteId === 4973582) {
    res.locals.err = "Damn Daniele";
    //this 1 dude is half my sub-updates and he never has any ride info.
    return next();
  }

  const userIds = await getKOMUsers();
  //Validate Request
  if (
    !athleteId ||
    !aspectType ||
    // !subscriptionId ||
    !activityId ||
    !userIds.includes(athleteId) || //user sign up for KOM mapper
    aspectType !== "create" //|| //grab initial creation
    // subscriptionId !== config.subscriptionId //weak validation
  ) {
    console.log("No need to parse sub further, validation failed.");
    return next();
  }

  console.log("Add to Q:", activityId, athleteId);
  await Activity.add(activityId, athleteId);

  //TODO see about adding rate limiting here if triggering this too much causes issues
  // but I don't see that happening for a while...
  stravaQ.processQueue();

  return next();
}

let lastFetchTime = null;
let userList = [];

async function getKOMUsers() {
  const now = dayjs();

  if (!lastFetchTime || now.diff(lastFetchTime, "seconds") > 30) {
    const dbUsers = await User.getAll();
    lastFetchTime = now;
    userList = dbUsers.filter((u) => u.startDate).map((u) => u.id);
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

  // const testStrava = new _stravaAPI.client(
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
    const { updateAllUserSinceLast } = require("../services/effortsServices");
    const result = await updateAllUserSinceLast();
    // const user = {
    //   id: 12345,
    //   expiresAt: "this time",
    //   accessToken: "baddaBing",
    //   Rabble: "baddaBing",
    // };
    // const result = await User.updatePartial(user);
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
    // const result = await Segment.pop(10, "error");

    // for (let i = 0; i < result.length; i++) {
    //   const s = result[i];
    //   s.line = "reset";
    //   s.hasLine = "false";
    //   await Segment.update(s);
    // }

    // const result = await parsePushNotification({}, { locals: {} }, () => {
    //   console.info("NEXT CALLED");
    // });

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

async function getLeaderboard(req, res, next) {
  if (res.locals.err) {
    next();
  }

  const segmentId = parseInt(req.query.segmentId, 10);

  const response = await got(`https://www.strava.com/segments/${segmentId}`);

  if (response.statusCode !== 200) {
    res.locals.err = `"HTML req error - found code:, ${response.statusCode}`;
    throw new Error();
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
    rowObj.activityId = rowObj.link.replace(/\D/g, "");
    ranks.push(rowObj);
  }

  res.locals.data = ranks;

  const segment = await Segment.get(segmentId);
  segment.leaderboard = ranks;
  segment.updated = dayjs().format();
  await Segment.update(segment);

  next();
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
  getLeaderboard,
  parsePushNotification,
};
