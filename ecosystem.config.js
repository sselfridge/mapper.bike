module.exports = {
  apps: [
    {
      name: "map",
      script: "server/start.js",
      env_production: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
      },
    },
  ],
};
