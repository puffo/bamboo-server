'use strict'

const dynamodb = require('./dynamodb')

module.exports.update = (event, context, callback) => {
    const timestamp = new Date().getTime()
    const data = JSON.parse(event.body)

    // validation
    if (
        typeof data.externalReference !== 'string' ||
        typeof data.email !== 'string' ||
        (data.mobileNumber && typeof data.mobileNumber !== 'string')
    ) {
        console.error('Validation Failed')
        callback(null, {
            statusCode: 400,
            headers: { 'Content-Type': 'text/plain' },
            body: "Couldn't update the User item.",
        })
        return
    }

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id: event.pathParameters.id,
        },
        ExpressionAttributeNames: {
            '#user_email': 'email',
        },
        ExpressionAttributeValues: {
            ':externalReference': data.externalReference,
            ':email': data.email,
            ':mobileNumber': data.mobileNumber,
            ':updatedAt': timestamp,
        },
        UpdateExpression:
            'SET #user_email = :email, externalReference = :externalReference, mobileNumber = :mobileNumber, updatedAt = :updatedAt',
        ReturnValues: 'ALL_NEW',
    }

    // update the User in the database
    dynamodb.update(params, (error, result) => {
        // handle potential errors
        if (error) {
            console.error(error)
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: { 'Content-Type': 'text/plain' },
                body: "Couldn't update the User item.",
            })
            return
        }

        // create a response
        const response = {
            statusCode: 200,
            body: JSON.stringify(result.Attributes),
        }
        callback(null, response)
    })
}
