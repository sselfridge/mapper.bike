const userServices = {
  getUserData,
  totalUserActivities,
};

function getUserData(res) {
  const user = res.locals.user;
  const accessToken = res.locals.accessToken;
  const refreshToken = res.locals.refreshToken;
  const userData = {
    id: user.athleteId,
    accessToken,
    refreshToken,
  };
  return userData;
}

async function totalUserActivities(strava, id) {
  const result = await strava.athletes.stats({ id });
  const count = result.all_ride_totals.count + result.all_run_totals.count;
  return count;
}

module.exports = userServices;
