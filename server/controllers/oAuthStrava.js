const jwtoken = require("jsonwebtoken");
const m = require("moment");
const Cryptr = require("cryptr");
const config = require("../../src/config/keys");
const cryptr = new Cryptr(config.secretSuperKey);

const utils = require("../utils/stravaUtils");

var stravaAPI = require("strava-v3");
stravaAPI.config({
  // "access_token"  : "Your apps access token (Required for Quickstart)",
  client_id: config.client_id,
  client_secret: config.client_secret,
  redirect_uri: config.redirect_uri,
});

module.exports = {
  setStravaOauth,
  loadStravaProfile,
  clearCookie,
};

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
      };

      utils.logUser(result.firstname, result.lastname, result.id);
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
    console.log(`Token Expires at ${expiresAt.format("hh:mm A")},`, expiresAt.fromNow());
    console.log("Refresh Token:", res.locals.refreshToken);
    if (m().isBefore(expiresAt)) {
      console.log("Token Not Expired");
      return resolve();
    } else {
      console.log("Token Expired");

      stravaAPI.oauth
        .refreshToken(res.locals.refreshToken)
        .then((result) => {
          let payload = {
            expiresAt: result.expires_at,
            refreshToken: result.refresh_token,
            accessToken: result.access_token,
            athleteId: res.locals.athleteId,
          };
          setJWTCookie(res, payload);
          res.locals.expiresAt = result.expires_at;
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
  const jwt = jwtoken.sign(payload, config.secretSuperKey);
  const crypted = cryptr.encrypt(jwt);
  res.cookie("mapperjwt", crypted, { httpOnly: true });
}

const decodeCookie = (res, jwt) => {
  return new Promise((resolve, reject) => {
    jwtoken.verify(jwt, config.secretSuperKey, (err, payload) => {
      if (err) {
        console.log(err);
        return reject("JWT / Cookie Invalid");
      }
      console.log(`JWT Valid - allow to proceed. athleteId: ${payload.athleteId}`);
      res.locals.expiresAt = m.unix(payload.expiresAt);
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
