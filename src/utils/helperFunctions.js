//shared functions used both in server and UI

const getActivityRankInLeaderboard = (activityId, leaderboard) => {
  const current = leaderboard.find((e) => e.activityId === `${activityId}`);

  if (current) {
    return Number(current.place);
  } else {
    return "--";
  }
};

module.exports = {
  getActivityRankInLeaderboard,
};
