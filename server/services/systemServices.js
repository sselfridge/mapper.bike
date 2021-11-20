const fs = require("fs");

const USER_LOG_FILE = "logs/users.txt";

function logUser(user) {
  const { firstname, lastname, athleteId } = user;

  let str = firstname + " " + lastname + " " + athleteId;
  if (str.length > 30) {
    str = str.substring(0, 30);
  } else {
    while (str.length < 30) str = str + " ";
  }
  let date = new Date().toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
  });
  str += date + "-PST \n";
  fs.appendFileSync(USER_LOG_FILE, str);
}

module.exports = { logUser };
