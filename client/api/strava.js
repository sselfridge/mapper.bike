import axios from "axios";

export const apiTest = () => {
  return new Promise((resolve, reject) => {
    const queryString = `/api/test`;
    axios
      .get(queryString)
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
    const beforeDate = before ? `${dateToEpoch(before)}` : "9999999999";

    const activityType = `${JSON.stringify(type)}`;

    const queryString = `/api/summaryActivities?after=${afterDate}&before=${beforeDate}&type=${activityType}`;

    axios
      .get(queryString)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
}

export function getDemoData() {
  return new Promise((resolve, reject) => {
    const queryString = `/api/demoData`;

    axios
      .get(queryString)
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
    const queryString = `/api/segmentEfforts?rank=${rank}`;
    axios
      .get(queryString)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
}

export function starSegment(id) {
  return new Promise((resolve, reject) => {
    const queryString = `/api/segments/${id}/star`;
    axios
      .post(queryString)
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

export function getUser(id) {
  return new Promise((resolve, reject) => {
    console.log("Getting User:", id);
    const queryString = `/api/users/${id}`;
    axios
      .get(queryString)
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
