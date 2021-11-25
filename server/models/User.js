const _userDb = require("./db/user_aws");

const dayjs = require("../utils/dayjs");

const _stravaAPI = global._stravaAPI;

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

  static updateTokens = async (data) => {
    await _userDb.updateTokens(data);
  };

  static updatePartial = async (data) => {
    if (!data.id) throw new Error("User must have ID");
    await _userDb.updatePartial(data);
  };

  static updateAdd = async (data) => {
    let user = await User.get(data.id);
    if (user === undefined) {
      user = {
        ...data,
        startDate: dayjs().format(),
        lastUpdate: dayjs().format(),
      };
    } else {
      user = {
        ...data,
      };
    }
    // const user = {
    //   expiresAt: 1636622298,
    //   refreshToken: "cd9b1cd5ccb1c0f4a2cdc0c246dbd558eb77a9e1",
    //   accessToken: "368c478eb38605d2892bcd6407227f84383227d1",
    //   id: 10645041,
    // };

    //  const asdf=  {
    //     expiresAt: 1636607148,
    //     startDate: '2021-11-07T17:54:34-08:00',
    //     refreshToken: '86d917edbf4ee0aef45e2a7522679cae3c7603ce',
    //     id: 1075670,
    //     lastUpdate: '2021-11-10T07:30:22-08:00',
    //     accessToken: 'f75d609593d2222dda52c0be13a789b2d1db8515'
    //   }

    await _userDb.update(user);
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

    if (!user) throw new Error("No user found for athleteId", athleteId);

    const strava = await this.#makeStravaClient(user);

    const full = await strava.activities.get({
      id: activityId,
      include_all_efforts: true,
    });
    return full;
  };

  static #makeStravaClient = async (user) => {
    const { expiresAt } = user;
    const now = dayjs();

    if (now.isAfter(dayjs.unix(expiresAt))) {
      user = await this.#refreshStravaTokens(user);
    }

    return new _stravaAPI.client(user.accessToken);
  };

  static #refreshStravaTokens = async (user) => {
    try {
      const result = await _stravaAPI.oauth.refreshToken(user.refreshToken);
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
    //get main app strava refresh info
    const appUser = await this.get(1);

    const appStrava = await this.#makeStravaClient(appUser);

    const segment = await appStrava.segments.get({ id });

    console.info(
      "segment (id, char size): ",
      id,
      JSON.stringify(segment).length
    );
    return segment;
  };
}

module.exports = User;
