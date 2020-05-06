import axios from "axios";

export const NULL_USER = {
  avatar: null,
  firstname: null,
  lastname: null,
  athleteId: null,
};

export function getCurrentUser() {
  console.log("Get Current User");
  return new Promise((resolve, reject) => {
    axios
      .get(`/api/getStravaUser`)
      .then((result) => {
        return resolve(result.data);
      })
      .catch((err) => {
        console.log("API:Get User Error");
        console.log(err);
        return reject();
      });
  });
}

export function logout() {
  return new Promise((resolve, reject) => {
    axios
      .post("/api/logout")
      .then(() => {
        resolve();
      })
      .catch((err) => {
        console.log("API:Logout Error");
        console.log(err);
        return reject();
      });
  });
}

export function getActivities(type, after, before) {
  return new Promise((resolve, reject) => {
    const afterDate = after ? `${dateToEpoch(after)}` : "0";
    const beforeDate = before ? `${dateToEpoch(after)}` : "9999999999";

    const activityType = `type=${JSON.stringify(type)}`;

    const quereyString = `/api/summaryActivities?after=${afterDate}&before=${beforeDate}&${activityType}`;

    axios
      .get(quereyString)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

function dateToEpoch(date) {
  const number = Math.floor(date.getTime() / 1000);
  return number;
}
