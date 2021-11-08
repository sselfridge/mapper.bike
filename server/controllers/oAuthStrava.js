const jwToken = require("jsonwebtoken");
// const m = require("moment");
const dayjs = require("../utils/dayjs");
const Cryptr = require("cryptr");
const config = require("../../src/config/keys");
const cryptr = new Cryptr(config.secretSuperKey);
const stravaQ = require("../services/stravaQueue");
const { logUser } = require("../services/systemServices");

var stravaAPI = require("strava-v3");
stravaAPI.config({
  // "access_token"  : "Your apps access token (Required for Quickstart)",
  client_id: config.client_id,
  client_secret: config.client_secret,
  redirect_uri: config.redirect_uri,
});

// EXPORTED Functions
function setStravaOauth(req, res, next) {
  let code = req.query.code;
  console.log(`Strava Code: ${code}`);

  stravaAPI.oauth
    .getToken(code)
    .then((result) => {
      let payload = {
        expiresAt: result.expires_at,
        refreshToken: result.refresh_token,
        accessToken: result.access_token,
        athleteId: result.athlete.id,
      };

      setJWTCookie(res, payload);
      next();
    })
    .catch((err) => {
      console.log("Error during Oauth");
      console.log(err);
      next();
    });
}

function loadStravaProfile(req, res, next) {
  console.log("loadStravaProfile");
  const jwt = decryptJwt(req.cookies.mapperjwt);

  decodeCookie(res, jwt)
    .then(checkRefreshToken)
    .then(() => res.locals.strava.athlete.get({}))
    .then((result) => {
      res.locals.user = {
        avatar: result.profile,
        firstname: result.firstname,
        lastname: result.lastname,
        athleteId: result.id,
        premium: result.premium,
        city: result.city,
        state: result.state,
      };

      logUser(result.firstname, result.lastname, result.id);
      next();
    })
    .catch((err) => {
      console.log("Error while loading Strava Profile\n", err);
      res.locals.err = "Error Loading Strava Profile";
      // clearCookie(req, res, next);
      next();
    });
}

//check if the access token is expired, if so request a new one
const checkRefreshToken = (res) => {
  return new Promise((resolve, reject) => {
    const expiresAt = res.locals.expiresAt;
    console.log(
      `Token Expires at ${expiresAt.format("hh:mm A")} (${expiresAt
        .utc()
        .format("hh:mm")}GMT),`,
      expiresAt.fromNow()
    );
    console.log("Refresh Token:", res.locals.refreshToken);
    if (dayjs().isBefore(expiresAt)) {
      console.log("Token Not Expired");
      return resolve();
    } else {
      console.log("Token Expired");

      stravaAPI.oauth
        .refreshToken(res.locals.refreshToken)
        .then(async (result) => {
          //update user refresh token in DB
          const athleteId = res.locals.athleteId;
          await stravaQ.updateUserRefreshToken(athleteId, result.refresh_token);
          return result;
        })
        .then((result) => {
          let payload = {
            expiresAt: result.expires_at,
            refreshToken: result.refresh_token,
            accessToken: result.access_token,
            athleteId: res.locals.athleteId,
          };

          setJWTCookie(res, payload);
          res.locals.expiresAt = dayjs.unix(result.expires_at);
          res.locals.accessToken = result.access_token;
          res.locals.strava = new stravaAPI.client(result.access_token);
          return resolve();
        })
        .catch((err) => {
          console.log("Error During Token Refresh");
          console.log(err);
          reject("Error During Token Refresh");
        });
    }
  });
};

function decryptJwt(jwt) {
  let hubCookie;
  try {
    hubCookie = cryptr.decrypt(jwt);
  } catch (error) {
    hubCookie = "This Will Fail";
  }
  return hubCookie;
}

function setJWTCookie(res, payload) {
  console.log("Set JWT", payload);
  const jwt = jwToken.sign(payload, config.secretSuperKey);
  const encrypted = cryptr.encrypt(jwt);
  res.cookie("mapperjwt", encrypted, { httpOnly: true });
}

const decodeCookie = (res, jwt) => {
  return new Promise((resolve, reject) => {
    jwToken.verify(jwt, config.secretSuperKey, (err, payload) => {
      if (err) {
        console.log(err);
        return reject("JWT / Cookie Invalid");
      }
      console.log(`JWT Valid - athleteId: ${payload.athleteId}`);
      res.locals.expiresAt = dayjs.unix(payload.expiresAt);
      res.locals.strava = new stravaAPI.client(payload.accessToken);
      res.locals.accessToken = payload.accessToken;
      res.locals.refreshToken = payload.refreshToken;
      res.locals.athleteId = payload.athleteId;
      console.log("Access Token: ", res.locals.accessToken);
      return resolve(res);
    });
  });
};

function clearCookie(req, res, next) {
  console.log("clear cookie: mapperjwt");
  res.clearCookie("mapperjwt", { httpOnly: true });
  next();
}

function adminOnly(req, res, next) {
  // keep those not me from hitting admin functions
  const userAthleteId =
    res.locals && res.locals.user && res.locals.user.athleteId;

  const athleteId = res.locals.athleteId;

  if (userAthleteId !== athleteId || athleteId !== 1075670) {
    res.locals.err = "Not authorized for testing";
    return next();
  }
  next();
}

module.exports = {
  setStravaOauth,
  loadStravaProfile,
  clearCookie,
  adminOnly,
};
