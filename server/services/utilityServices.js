// takes a string that represents a date and returns the epoch time in seconds
// "2012-02-15T21:20:29Z" --> 1329340829
function makeEpochSecondsTime(timeString) {
  const date = new Date(timeString);
  return Math.floor(date.getTime() / 1000);
}

module.exports = {
  makeEpochSecondsTime,
};
