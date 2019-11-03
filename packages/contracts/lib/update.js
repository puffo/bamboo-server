'use strict'

const dynamodb = require('./dynamodb')

module.exports.update = (event, context, callback) => {
    const timestamp = new Date().getTime()
    const data = JSON.parse(event.body)

    // validation
    if (
        typeof data.duration !== 'string' ||
        typeof data.price !== 'string' ||
        typeof data.validUntil !== 'string' ||
        typeof data.terms !== 'string' ||
        typeof data.accepted !== 'boolean' ||
        typeof data.userId !== 'string'
    ) {
        console.error('Validation Failed')
        callback(null, {
            statusCode: 400,
            headers: { 'Content-Type': 'text/plain' },
            body: "Couldn't update the Product item.",
        })
        return
    }

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id: event.pathParameters.id,
        },
        ExpressionAttributeNames: {
            '#contract_duration': 'duration',
            '#contract_price': 'price',
            '#contract_terms': 'terms',
            '#contract_valid_until': 'validUntil',
            '#contract_user_id': 'userId',
            '#contract_product_id': 'productId',
        },
        ExpressionAttributeValues: {
            ':duration': data.duration,
            ':price': data.price,
            ':terms': data.terms,
            ':validUntil': data.validUntil,
            ':accepted': data.accepted,
            ':userId': data.userId,
            ':productId': data.productId,
            ':updatedAt': timestamp,
        },
        UpdateExpression:
            'SET #contract_duration = :duration, #contract_price = :price, #contract_valid_until = :validUntil, #contract_terms = :terms, accepted = :accepted,  #contract_user_id = :userId, #contract_product_id = :productId, updatedAt = :updatedAt',
        ReturnValues: 'ALL_NEW',
    }

    // update the Product in the database
    dynamodb.update(params, (error, result) => {
        // handle potential errors
        if (error) {
            console.error(error)
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: { 'Content-Type': 'text/plain' },
                body: "Couldn't update the Product item.",
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
