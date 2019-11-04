require("dotenv").config();

const Messenger = require("./messenger.js");

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require("twilio")(twilioAccountSid, twilioAuthToken); // eslint-disable-line

module.exports.confirm = (event, context, callback) => {
  const messenger = new Messenger(twilioClient);

  const response = {
    headers: { "Access-Control-Allow-Origin": "*" }, // CORS requirement
    statusCode: 200
  };

  Object.assign(event, { from: process.env.TWILIO_PHONE_NUMBER });

  messenger
    .checkVerification(event)
    .then(message => {
      response.body = JSON.stringify({
        message: "Number confirmed!",
        data: message
      });
      callback(null, response);
    })
    .catch(error => {
      response.statusCode = error.status;
      response.body = JSON.stringify({
        message: error.message,
        error: error // eslint-disable-line
      });
      callback(null, response);
    });
};
