"use strict";

const uuid = require("uuid");
const dynamodb = require("./dynamodb");

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  if (
    typeof data.externalReference !== "string" ||
    typeof data.email !== "string" ||
    (data.mobileNumber && typeof data.mobileNumber !== "string")
  ) {
    console.error("Validation Failed");
    callback(null, {
      statusCode: 400,
      headers: { "Content-Type": "text/plain" },
      body: "Couldn't create the User item."
    });
    return;
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid.v1(),
      externalReference: data.externalReference,
      email: data.email,
      mobileNumber: data.mobileNumber,
      createdAt: timestamp,
      updatedAt: timestamp
    }
  };

  // write the User to the database
  dynamodb.put(params, error => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { "Content-Type": "text/plain" },
        body: "Couldn't create the User item."
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item)
    };
    callback(null, response);
  });
};
