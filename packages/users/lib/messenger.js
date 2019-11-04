"use strict";
require("dotenv").config();

class Messenger {
  constructor(client) {
    this.client = client;
  }

  verify(event) {
    this.client.verify
      .services(process.env.VERIFICATION_SID)
      .verifications.create({ to: JSON.parse(event.body).to, channel: "sms" })
      .then(verification => console.log(verification.status));
  }
}

module.exports = Messenger;
