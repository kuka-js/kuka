# serverless_jwt_boilerplate - WORK IN PROGRESS

A Typescript jwt boilerplate using the Serverless framework

## Development

- `npm i -g serverless`
- `npm i`
- `sls offline start`
- Start modifying your ts files. Hot reload AKA Every save will automatically restart the server :)

## Deployment

- Setup [AWS credentials](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/setup-credentials.html)
- Run `cp .env.development.template .env.development`. Then modify .env.development with your the correct DB credentials and AWS region. Do the same to the other env template files.
- Then depending on where you want to deploy. Run

* `sls deploy --env development`
* `sls deploy --env staging`
* `sls deploy --env production`

## What works

- Register endpoint
- Login endpoint (returns token)
- Hidden endpoint (endpoint to test that token verification works)
- Local dev uses sqlite for DB. (no config needed)
- Deployment works. Connects to the DB. Put your DB settings in the .env._stage_

## To do

- Reset password
- Confirmation email
