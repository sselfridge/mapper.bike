//shared functions used both in server and UI

const appendLeaderboard = (activityId, leaderboard) => {
  const current = leaderboard.find((e) => e.activityId === `${activityId}`);

  if (current) {
    return parseInt(current.place, 10);
  } else {
    return "--";
  }
};

module.exports = {
  appendLeaderboard,
};
