const fal = require('@fal-ai/serverless-client');

const key = process.env.FALAI_KEY

fal.config({
    credentials: key,
});

module.exports = fal;