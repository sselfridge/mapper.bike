const db = require("./db/user_aws");
// const Activity = require("./Activity");

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
    const userExists = await db.exists(id);
    console.log("User Exists:", userExists);
    if (userExists) {
      throw new Error("User Already in DB");
    } else {
      console.log("Add user:", data);
      await db.update(data);
    }
  };

  static update = async (data) => {
    const userExists = await db.exists(data.id);
    if (!userExists) throw new Error("Update Error: User not in DB");
    else {
      await db.update(data);
    }
  };

  static get = async (id) => {
    const user = await db.get(id);
    return user;
  };

  static getAll = async () => {
    const allUsers = await db.getAll();
    return allUsers;
  };

  static refreshStravaTokens = async (user) => {
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
      db.update(user);
      return user;
    } catch (error) {
      console.error("Unable to update user in DB");
      return null;
    }
  };

  static makeStravaClient = async (user) => {
    const { expiresAt } = user;
    const now = dayjs();

    if (now.isAfter(dayjs.unix(expiresAt))) {
      user = await this.refreshStravaTokens(user);
    }

    return new stravaAPI.client(user.accessToken);
  };

  static fetchActivitiesAfter = async (user, after) => {
    const strava = await this.makeStravaClient(user);

    const result = await summaryServices.fetchActivities(
      strava,
      after,
      2550000000
    );

    return result;
  };
}

module.exports = User;
