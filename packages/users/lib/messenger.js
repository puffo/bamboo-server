"use strict";
require("dotenv").config();

class Messenger {
  constructor(client) {
    this.client = client;
  }

  createVerification(event) {
    const mobileNumber = JSON.parse(event.body).to;

    return this.client.verify
      .services(process.env.VERIFICATION_SID)
      .verifications.create({ to: mobileNumber, channel: "sms" })
      .then(verification => console.log(verification.status));
  }

  checkVerification(event) {
    const data = JSON.parse(event.body);
    const mobileNumber = data.to;
    const code = data.code;

    return this.client.verify
      .services(process.env.VERIFICATION_SID)
      .verificationChecks.create({
        to: mobileNumber,
        code: code
      })
      .then(verification => console.log(verification.status));
  }
}

module.exports = Messenger;
