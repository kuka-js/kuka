#!/usr/bin/env bash
set -e
npm config set @kuka-js:registry http://registry.npmjs.org
npm config set //registry.npmjs.org/:_authToken $NPM_TOKEN
npm whoami
npm ci --also=dev
node spawn-sls-offline.js
curl --verbose -X POST -H 'Content-Type: application/json' -d '{"username":"nake89+debug1@gmail.com","email":"nake89+debug1@gmail.com","password":"nake89@gmail.COM"}' http://localhost:4000/test/register
npm test
npm run semantic-release
