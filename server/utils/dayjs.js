const dayjs = require("dayjs");

const plugins = ["utc"];

plugins.forEach((plugin) => {
  const importedPlugin = require(`dayjs/plugin/${plugin}`);
  dayjs.extend(importedPlugin);
});

module.exports = dayjs;
