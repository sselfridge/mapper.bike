module.exports = {
  apps: [
    {
      name: "map",
      script: "server/start.js",
      env_production: {
        NODE_ENV: "production",
        QWERTY: "$(eqwerqwerllo)",
        ZZZZ: "ohe",
      },
      env_development: {
        NODE_ENV: "development",
      },
    },
  ],
};
