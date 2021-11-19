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

export const apiTestReset = () => {
  return new Promise((resolve, reject) => {
    const queryString = `/api/test/reset`;
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
  avatar:
    "https://dgalywyr863hv.cloudfront.net/pictures/athletes/58248365/14987542/1/large.jpg",
  firstname: "LaGrange",
  lastname: "Group Rides",
  athleteId: 101,
  city: "Santa Monica",
  state: "California",
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
    const afterDate = after ? after : "0";

    //Add 1 day - 100 seconds to before date to cover the entire day
    let beforeDate = before ? before + 86300 : "9999999999";

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
        console.log("Error Initializing user:");
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
