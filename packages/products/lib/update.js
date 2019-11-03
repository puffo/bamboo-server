'use strict'

const dynamodb = require('./dynamodb')

module.exports.update = (event, context, callback) => {
    const timestamp = new Date().getTime()
    const data = JSON.parse(event.body)

    // validation
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
            '#product_image_url': 'imageUrl',
            '#product_image_text': 'imageText',
            '#product_description': 'description',
            '#product_title': 'title',
            '#product_user_id': 'userId',
        },
        ExpressionAttributeValues: {
            ':imageUrl': data.imageUrl,
            ':imageText': data.imageText,
            ':title': data.title,
            ':description': data.description,
            ':isFavorite': data.isFavorite,
            ':userId': data.userId,
            ':updatedAt': timestamp,
        },
        UpdateExpression:
            'SET #product_image_url = :imageUrl, #product_image_text = :imageText, #product_title = :title, #product_description = :description, isFavorite = :isFavorite,  #product_user_id = :userId, updatedAt = :updatedAt',
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
