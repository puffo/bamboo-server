# bamboo-server

Bamboo Insurance minimum viable product (MVP) application packages, ready to deploy quickly using [Serverless](http://serverless.com/) infrastructure. Packages can also be deployed directly to AWS Lambda.

## Features

Three microservices with full CRUD functionality to support the Bamboo Insurance product offering.

- Users
- Products
- Contracts

Given the nature of startup projects, the solution is geared towards getting an MVP up and running as quickly as possible, with as much functionality given the timelines. `Serverless` is a great solution to avoid the normal configuration overhead for AWS Gateway + AWS Lambda + AWS DynamoDB + AWS IAM.

## Getting up and running

The project is a `lerna` monorepo. Linting is provided by `es-lint`, and code is formatted according to the `prettier` style. These are enforced using the `husky` package along with `lint-staged`

### Running locally

The project uses `serverless-offine` and `serverless-dynamodb-local` to stub out AWS lambda functionality. Clone the repo locally and use `npm` to install dependencies. Each service can be run from it's package directory. For example, running the `Products` microservice locally:

```
$ npm install -g serverless
$ cd packages/products
$ npm install
$ serverless offline deploy
```

### Running Tests

Tests have not been implemented for this version due to time constraints and the MVP goal, but tests are available to run in future versions:

```
lerna run test
```

### Deploying

Assuming you have logged into the `serverless` CLI with your account, run the following command to deploy all services:

```
$ lerna run deploy
```
