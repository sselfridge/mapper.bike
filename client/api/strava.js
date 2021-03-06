import axios from "axios";

export const apiTest = () => {
  return new Promise((resolve, reject) => {
    const quereyString = `/api/test`;
    axios
      .get(quereyString)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

export const NULL_USER = {
  avatar: null,
  firstname: null,
  lastname: null,
  athleteId: null,
};

export const DEMO_USER = {
  avatar: "https://dgalywyr863hv.cloudfront.net/pictures/athletes/58248365/14987542/1/large.jpg",
  firstname: "LaGrange",
  lastname: "Group Rides",
  athleteId: 101,
};

export function getCurrentUser() {
  return new Promise((resolve, reject) => {
    axios
      .get(`/api/getStravaUser`)
      .then((result) => {
        return resolve(result);
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
    const beforeDate = before ? `${dateToEpoch(before) + 86300}` : "9999999999";

    const activityType = `${JSON.stringify(type)}`;

    const quereyString = `/api/summaryActivities?after=${afterDate}&before=${beforeDate}&type=${activityType}`;

    axios
      .get(quereyString)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function getDemoData() {
  return new Promise((resolve, reject) => {
    const quereyString = `/api/demoData`;

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

export function getEfforts(rank = 10) {
  return new Promise((resolve, reject) => {
    console.log("Getting Efforts");
    const quereyString = `/api/segmentEfforts?rank=${rank}`;
    axios
      .get(quereyString)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
}

export function getUser(id) {
  return new Promise((resolve, reject) => {
    console.log("Getting User:", id);
    const quereyString = `/api/users/${id}`;
    axios
      .get(quereyString)
      .then((response) => {
        const data = response.status === 200 ? response.data : undefined;
        resolve(data);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
}

export function initializeUser() {
  return new Promise((resolve, reject) => {
    console.log("initialize User");
    axios
      .post("/api/initialize")
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        console.log("Error Intializizing user:");
        console.log(err);
        reject(err);
      });
  });
}

export function kickoffQ() {
  console.log("Kickoff Queue!");
  return new Promise((resolve, reject) => {
    axios
      .get("/api/kickoffQ")
      .then(() => {
        resolve();
      })
      .catch((err) => {
        console.error(err);
        reject(err);
      });
  });
}

export function deleteUser(id) {
  return new Promise((resolve, reject) => {
    axios
      .delete(`/api/users/${id}`)
      .then(() => {
        console.log("Deleted User:", id);
        resolve();
      })
      .catch((err) => {
        console.error(err);
        reject(err);
      });
  });
}
