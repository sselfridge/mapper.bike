const db = require("./db/user_aws");
const Activity = require("./Activity");
const Effort = require("./Effort");

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

  static remove = async (athleteId) => {
    console.log("Deleting User ID", athleteId);

    //delete activities if any in progress
    const activitiesQ = await Activity.getAll();
    const actIds = activitiesQ
      .filter((result) => result.athleteId === athleteId)
      .map((result) => result.id);
    console.log(`Deleting ${actIds.length} activities from queue`);
    await Activity.delete(actIds);

    //delete efforts
    const results = await Effort.get(athleteId, 10);
    console.log(`Got ${results.length} to delete`);
    const ids = results.map((result) => result.id);

    console.log(`Deleting ${ids.length} efforts`);
    await Effort.delete(ids);
    await db.remove(athleteId);
  };
}

module.exports = User;
