const config = require("../../config/keys");

const accountSid = config.twilioAccount;
const authToken = config.twilioKey;
const client = require("twilio")(accountSid, authToken);

//this doesn't really belong here but I needed a server and curious 

function squirrel(req, res, next) {
  const key = req.query.key;
  console.log(`Key:${key}`);
  const url = req.query.url;
  console.log(`url:${url}`);

  if (key === config.squirrelKey) {
    client.messages
      .create({
        body: url,
        from: config.twilioNum,
        to: config.twilioTo
      })
      .then(message => console.log(message.sid));
  }
}

module.exports = squirrel;
