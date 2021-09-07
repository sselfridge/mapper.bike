const env = process.env.NODE_ENV;

console.log(`ENV:${env}`);

const prodKeys = {
  client_id: "",
  client_secret: "",
  callback_uri: "",
  redirect_url: "",
  //jwt token
  secretSuperKey: "",

  mapsApi: ""
};

const devKeys = {
  client_id: "",
  client_secret: " ",
  callback_uri: "",
  redirect_url: "",
  //jwt token
  secretSuperKey: "",

  mapsApi: ""
};

const keys = env === "production" ? prodKeys : devKeys;

module.exports = keys;
