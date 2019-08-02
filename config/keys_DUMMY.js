const env = process.env.NODE_ENV;

console.log(`ENV:${env}`);

prodKeys = {
  client_id: "",
  client_secret: "",
  callback_uri: "",
  redirect_url: "",
  twilioTo: ""
};

stagingKeys = {
  client_id: "",
  client_secret: "",
  callback_uri: "",
  redirect_url: "",
  twilioTo: ""
};

devKeys = {
  client_id: "",
  client_secret: "",
  callback_uri: "",
  redirect_url: "",
  twilioTo: ""
};

let keys;

switch (env) {
  case "production":
    keys = prodKeys;
    break;
  case "staging":
    keys = stagingKeys;
    break;
  default:
    keys = devKeys;
    break;
}

keys.secretSuperKey = "";
keys.mapsApi = "";
keys.twilioKey = "";
keys.twilioAccount = "";
keys.twilioNum = "";
keys.squirrelKey = "";

module.exports = keys;
