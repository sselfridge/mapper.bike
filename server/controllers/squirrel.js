// const config = require("../../config/keys");
// const fs = require('fs');

// const accountSid = config.twilioAccount;
// const authToken = config.twilioKey;
// const client = require("twilio")(accountSid, authToken);

// //this doesn't really belong here but I needed a server and curious 

// function squirrel(req, res, next) {
//   const key = req.query.key;
//   const url = req.query.url;

//   if (key === config.squirrelKey) {
//     fs.appendFileSync('logs/links.txt',url);
//     client.messages
//       .create({
//         body: url,
//         from: config.twilioNum,
//         to: config.twilioTo
//       })
//       .then(message => console.log("Squirrel:",url));
//   }
// }

// module.exports = squirrel;
