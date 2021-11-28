![banner](https://user-images.githubusercontent.com/6876030/111069985-46c43c00-84d8-11eb-9d2b-fedd988c15f1.png)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/kuka-js/kuka/kuka) [![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/kuka-js/kuka/graphs/commit-activity) [![GitHub license](https://img.shields.io/github/license/kuka-js/kuka.svg)](https://github.com/kuka-js/kuka/blob/master/LICENSE) [![GitHub issues-closed](https://img.shields.io/github/issues-closed/kuka-js/kuka.svg)](https://GitHub.com/kuka-js/kuka/issues?q=is%3Aissue+is%3Aclosed) [![Average time to resolve an issue](https://isitmaintained.com/badge/resolution/kuka-js/kuka.svg)](https://isitmaintained.com/project/kuka-js/kuka "Average time to resolve an issue") [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

# Kuka.js (/'kuka/ KOO-kah)

A serverless user management system using JWT. Runs as a separate microservice in AWS Lambda independent of the app you want use authentication in. You need to share the secret used here with your app and it can decrypt the JWT. Currently in alpha stage, but basic functionality working (register, login, etc). Pull requests and issues are appreciated!

### Why?

- User management that scales indepenedent of your app.

### How?

- AWS Lambda (fast infinitely scalable stateless functions)
- DynamoDB (infinitely scalable database)

[API Documentation](https://kuka-js.github.io/kuka/apidocs.html) - Out of date

## Versioning and status of project

Version 2 when released will fully adhere to Semantic Versioning. During the current version (v1) every minor (1.X.X) and patch (1.0.X) version can result in breaking changes.

## Features

- Login
- Register
- Add and remove scopes
- Supports multiple databases types (DynamoDB, MySQL, MariaDB, Postgres, SQLite)

## Development

- `npm i -g serverless`
- `cd packages/kuka-serverless`
- `npm i -D`
- `cp .env.localdev.template .env.localdev`. Then modify .env.local with your details.
- `sls offline start --env localdev`
- Start modifying your ts files. Hot reload, ie. every save will automatically restart the server :)

### .env variables

In local and maybe even in dev, you might want to have email addresses to be auto-verified.
In that case, have this in your .env.local: `AUTO_VERIFY_MAIL=true`
To reset passwords in dev without email sending capability, you can put this in .env.local: `AUTO_SEND_PASSWORD_RESET_ID=true`. Then the reset endpoint will return the password reset ID immediately. DO NOT USE THIS IN ANYTHING BUT LOCAL OR DEV MODE! Otherwise anyone can reset your password through this endpoint. This is for testing purposes only.
If you want to use DynamoDB. In your .env file, set DB_PROVIDER to dynamodb. If you want to use any of the other databases, set it to typeorm and set TYPEORM_CONNECTION to the database you want to use. More info here: [TypeORM .env documentation](https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md#using-environment-variables). If you want to use DynamoDB, make sure your AWS Lambda function has access to your DynamoDB table. You can do this in AWS IAM.

### Email

Verifying email and password resetting needs email (unless you turn them off, see above). Make sure your .env has `VER_SENDER` and `VER_RECIPIENT` set. `VER_SENDER` should be the email address
from which the verification link is sent, and `VER_RECIPIENT` is the email the link is sent to. `VER_RECIPIENT` is needed only in development, local, and testing stages.

#### SMTP

You can enter your own SMTP credentials in the .env files.
If you're developing and dont have a SMTP server yet, you can use a service like https://www.smtpbucket.com/ . Just make sure you have `MAIL_NO_AUTH` set to true and `MAIL_PORT` to what the service asks for.

#### AWS SES

To use AWS Simple Email Service read this: https://docs.aws.amazon.com/ses/latest/DeveloperGuide/quick-start.html

## Deployment

- Setup [AWS credentials](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/setup-credentials.html)
- Run `cp .env.development.template .env.development`. Then modify .env.development with your DB credentials and AWS region. Do the same to the other .env template files.
- Then, depending on where you want to deploy, run

* `sls deploy --env development`
* `sls deploy --env staging`
* `sls deploy --env production`

### Known Issues

Deployment does not work from Mac directly. This is due the the fact that during the npm install (I think) it compiles some bcrypt stuff and this does not run on Linux (AWS Lambda). Why it works like this is beyond me. Easy workaround is to just deploy from GitHub Actions or any Linux machine you have (EC2 or some VPS).

## How it works

The first user created will be the root user. The root user has the rights to add and remove scopes. If you want to let other users list, add, or remove scopes, give them the following scopes:

- getScopes
- addScope
- removeScope

Also read the openapi.yml for more information about the endpoints.

## What works

- Register endpoint
- Email verification endpoint
- Login endpoint (returns token)
- Hidden endpoint (endpoint to test that token verification works)
- Scopes: ability to list, add and remove scopes
- Password reset
- Local dev uses sqlite for DB (no config needed)
- Deployment works. Connects to the DB. Put your DB settings in the .env._staging_
