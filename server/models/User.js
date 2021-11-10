const _userDb = require("./db/user_aws");

const dayjs = require("../utils/dayjs");

const config = require("../../src/config/keys");
var stravaAPI = require("strava-v3");
stravaAPI.config({
  client_id: config.client_id,
  client_secret: config.client_secret,
  redirect_uri: config.redirect_uri,
});

const summaryServices = require("../services/summaryServices");

class User {
  static add = async (data) => {
    console.log("Data: Add User");
    const id = data.id;
    const userExists = await _userDb.exists(id);
    console.log("User Exists:", userExists);
    if (userExists) {
      throw new Error("User Already in DB");
    } else {
      console.log("Add user:", data);
      await _userDb.update(data);
    }
  };

  static update = async (data) => {
    const userExists = await _userDb.exists(data.id);
    if (!userExists) throw new Error("Update Error: User not in DB");
    else {
      await _userDb.update(data);
    }
  };

  static get = async (id) => {
    const user = await _userDb.get(id);
    return user;
  };

  static getAll = async () => {
    const allUsers = await _userDb.getAll();
    return allUsers;
  };

  static fetchActivitiesAfter = async (user, after) => {
    const strava = await this.#makeStravaClient(user);

    const result = await summaryServices.fetchActivities(
      strava,
      after,
      2550000000
    );

    return result;
  };

  static getFullActivity = async (athleteId, activityId) => {
    const user = await this.get(athleteId);
    const strava = await this.#makeStravaClient(user);

    const full = await strava.activities.get({
      id: activityId,
      include_all_efforts: true,
    });
    console.log("full: ", JSON.stringify(full).length);
    return full;
  };

  static #makeStravaClient = async (user) => {
    const { expiresAt } = user;
    const now = dayjs();

    if (now.isAfter(dayjs.unix(expiresAt))) {
      user = await this.#refreshStravaTokens(user);
    }

    return new stravaAPI.client(user.accessToken);
  };

  static #refreshStravaTokens = async (user) => {
    try {
      const result = await stravaAPI.oauth.refreshToken(user.refreshToken);
      const { expires_at, refresh_token, access_token } = result;
      //TODO validate input
      user.expiresAt = expires_at;
      user.refreshToken = refresh_token;
      user.accessToken = access_token;
    } catch (error) {
      console.error("Unable to refresh token for user:", user.id);
      return null;
    }

    try {
      _userDb.update(user);
      return user;
    } catch (error) {
      console.error("Unable to update user in DB");
      return null;
    }
  };

  static getFullSegment = async (id) => {
    const appUser = await this.get(1);
    console.log("appUser: ", appUser);
    const appStrava = await this.#makeStravaClient(appUser);
    console.log("appStrava: ", appStrava);

    const segment = await appStrava.segments.get({ id });

    console.log("segment: ", segment);
  };
}

module.exports = User;
