const db = require("../db/dataLayer");
const m = require("moment");
const config = require("../../src/config/keys");

const got = require("got");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

//services
const {
  getUserData,
  addToActivityQueue,
} = require("../services/effortsServices");

// const awsTest = require("../../awsTest");

async function updateUserDB(req, res, next) {
  console.log("updating user in DB");
  const userData = getUserData(res);

  try {
    await db.updateUser(userData);
  } catch (err) {
    res.locals.err = err;
    return next();
  }
  return next();
}

async function initializeUser(req, res, next) {
  console.log("initialize User");
  try {
    const strava = res.locals.strava;
    const userData = getUserData(res);
    userData.startDate = m().format();
    userData.lastUpdate = m().format();
    await db.addUser(userData);

    //kick_off get activities
    addToActivityQueue(strava);
    const count = await totalUserActivities(strava, res.locals.user.athleteId);
    res.locals.data = { activityCount: count };
    return next();
  } catch (err) {
    console.log("Initialize Error:");
    console.log(err);
    res.locals.err = err;
    return next();
  }
}

async function getUser(req, res, next) {
  const id = parseInt(req.params.id);
  try {
    const user = await db.getUser(id);
    res.locals.user = user;
    next();
  } catch (error) {
    res.locals.err = "Error Fetching User";
    console.error(error);
    next();
  }
}

async function segmentEfforts(req, res, next) {
  const athleteId = res.locals.user.athleteId;
  const rank = parseInt(req.query.rank ? req.query.rank : 1);
  const efforts = await db.getEffortsWithPath(athleteId, rank);
  console.log(`Got ${efforts.length} efforts with details`);
  res.locals.segmentEfforts = efforts;
  next();
}

//TODO - update db structure to combine efforts?
async function updateEffort(req, res, next) {
  // params: activityId, segmentId
  //pull effort from DB
  //get current ranks
  //if different
  /*  update rank
   */
  //  update updated
}

async function totalUserActivities(strava, id) {
  const result = await strava.athletes.stats({ id });
  const count = result.all_ride_totals.count + result.all_run_totals.count;
  return count;
}

async function parsePushNotification(req, res, next) {
  console.log("parsePush");
  const userIds = await getUserIds();
  const update = req.body;

  const {
    owner_id: athleteId,
    aspect_type: aspectType,
    object_id: activityId,
    subscription_id: subscriptionId,
  } = update;

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
    next();
    return;
  }

  console.log("Add to Q:", activityId, athleteId);
  await db.addActivity(activityId, athleteId);

  next();
}

let lastFetchTime = null;
let userList = [];

async function getUserIds() {
  const now = m();

  if (!lastFetchTime || now.diff(lastFetchTime, "seconds") > 30) {
    const dbUsers = await db.getAllUsers();
    lastFetchTime = now;
    userList = dbUsers.map((u) => u.id);
  }

  return userList;
}

async function deleteUser(req, res, next) {
  const id = parseInt(req.params.id);

  if (res.locals.err) {
    return next();
  }

  try {
    if (res.locals.user.athleteId === id) {
      db.deleteUser(id);
      next();
    }
  } catch (error) {
    console.error("Delete User Error");
    console.error(error);
    res.locals.err = "Delete User Error";
    next();
  }
}

async function test(req, res, next) {
  console.log("Start Test");
  // const strava = res.locals.strava;

  // const stravaSub = require("strava-v3");

  // stravaSub.config({
  //   client_id: config.client_id,
  //   client_secret: config.client_secret,
  // });

  try {
    //   stravaSub.pushSubscriptions
    //     .list()
    //     // .create({
    //     //   callback_url: "http://9d6b-184-187-181-40.ngrok.io/api/gethook",
    //     //   verify_token: "1243567ui7tkuyjrrg34e5rut65",
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
    // const result = await strava.athlete.get({});
    // const result = await db.deleteUser(10645041);
    // const result = await db.getEffort("19676752-2019-08-17T16:13:29Z");
    // console.log("get Ranks");
    const result = await getLeaderboard(651706);
    // const result await db.
    // const result = await strava.segments.listEfforts({ id: 30179277, per_page: 200 });
    // const result = await summaryStrava.fetchActivitiesFromStrava(strava, 1590896066, 2599372000);
    // const result = await strava.activities.get({ id: 3593303190, include_all_efforts: true });
    // const result = await strava.segments.get({ id: 16616440 });
    // const result = await db.deleteUser(1075670);
    // const result = await strava.activities.get({ id: 3462588758 });
    console.info("----");
    console.log(result);
    console.info("----");
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
  // next();
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
  segmentEfforts,
  initializeUser,
  updateUserDB,
  getUser,
  deleteUser,
  parsePushNotification,
};
