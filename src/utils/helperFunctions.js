//shared functions used both in server and UI

const appendLeaderboard = (activityId, leaderboard) => {
  if (activityId == 4115863174) console.info("activityId: ", activityId);
  if (activityId == 4115863174) console.info("leaderboard: ", leaderboard);
  const current = leaderboard.find((e) => e.activityId === `${activityId}`);
  if (activityId == 4115863174) console.info("current: ", current);

  if (current) {
    return parseInt(current.place, 10);
  } else {
    return "--";
  }
};

module.exports = {
  appendLeaderboard,
};
