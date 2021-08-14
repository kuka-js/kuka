#!/usr/bin/env bash
set -e
npm config set @kuka-js:registry http://registry.npmjs.org
npm config set //registry.npmjs.org/:_authToken $NPM_TOKEN
npm whoami
npm ci --also=dev
./node_modules/serverless/bin/serverless.js config credentials --provider aws --key $AWS_KEY --secret $AWS_SECRET
./node_modules/serverless/bin/serverless.js deploy
CI_URL="https://$(node ./get-api-id.js).execute-api.eu-north-1.amazonaws.com/ci/"
sed -i -e "s|URL_PREFIX|$CI_URL|g" ./.newman/postman_environment.json
npm test
npm run semantic-release
