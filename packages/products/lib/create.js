'use strict'

const uuid = require('uuid')
const dynamodb = require('./dynamodb')

module.exports.create = (event, context, callback) => {
    const timestamp = new Date().getTime()
    const data = JSON.parse(event.body)
    if (
        typeof data.imageUrl !== 'string' ||
        typeof data.imageText !== 'string' ||
        typeof data.title !== 'string' ||
        typeof data.description !== 'string' ||
        typeof data.isFavorite !== 'boolean' ||
        typeof data.userId !== 'string'
    ) {
        console.error('Validation Failed')
        callback(null, {
            statusCode: 400,
            headers: { 'Content-Type': 'text/plain' },
            body: "Couldn't create the Product item.",
        })
        return
    }

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
            id: uuid.v1(),
            imageUrl: data.imageUrl,
            imageText: data.imageText,
            title: data.title,
            description: data.description,
            isFavorite: false,
            userId: data.userId,
            createdAt: timestamp,
            updatedAt: timestamp,
        },
    }

    // write the Product to the database
    dynamodb.put(params, error => {
        // handle potential errors
        if (error) {
            console.error(error)
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: { 'Content-Type': 'text/plain' },
                body: "Couldn't create the Product item.",
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
