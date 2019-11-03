'use strict'

const uuid = require('uuid')
const dynamodb = require('./dynamodb')

module.exports.create = (event, context, callback) => {
    const timestamp = new Date().getTime()
    const data = JSON.parse(event.body)
    if (
        typeof data.duration !== 'string' ||
        typeof data.price !== 'string' ||
        typeof data.terms !== 'string' ||
        typeof data.validUntil !== 'string' ||
        typeof data.accepted !== 'boolean' ||
        typeof data.userId !== 'string' ||
        typeof data.productId !== 'string'
    ) {
        console.error('Validation Failed')
        callback(null, {
            statusCode: 400,
            headers: { 'Content-Type': 'text/plain' },
            body: "Couldn't create the Contract item.",
        })
        return
    }

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
            id: uuid.v1(),
            duration: data.duration,
            price: data.price,
            terms: data.terms,
            validUntil: data.validUntil,
            accepted: false,
            userId: data.userId,
            productId: data.productId,
            createdAt: timestamp,
            updatedAt: timestamp,
        },
    }

    // write the Contract to the database
    dynamodb.put(params, error => {
        // handle potential errors
        if (error) {
            console.error(error)
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: { 'Content-Type': 'text/plain' },
                body: "Couldn't create the Contract item.",
            })
            return
        }

        // create a response
        const response = {
            statusCode: 200,
            body: JSON.stringify(params.Item),
        }
        callback(null, response)
    })
}
