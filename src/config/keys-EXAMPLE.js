const env = process.env.NODE_ENV;

// config version 2.0.1

const configs = {
  production: {
    callback_uri: "",
    redirect_url: "",
  },
  dev: {
    callback_uri: "",
    redirect_url: "",
  },
  test: {
    callback_uri: "",
    redirect_url: "",
  },
};

const keys = configs[env] || configs["dev"];

keys.client_id = "";
keys.client_secret = "";
keys.client_refresh = "";
keys.secretSuperKey = "";
keys.mapsApi = "";

module.exports = keys;
