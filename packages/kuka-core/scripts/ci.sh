#!/usr/bin/env bash
set -e
npm config set @kuka-js:registry https://registry.npmjs.org
npm config set //registry.npmjs.org/:_authToken $NPM_TOKEN
npm whoami
npm ci --also=dev
npm test
npm run build
npm run semantic-release
