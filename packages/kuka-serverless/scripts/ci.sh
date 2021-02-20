#!/usr/bin/env bash
set -e
npm config set @kuka-js:registry http://registry.npmjs.org
npm config set //registry.npmjs.org/:_authToken $NPM_TOKEN
npm whoami
npm ci --also=dev
node sls-offline-test-runner.js
npm test
npm run semantic-release
