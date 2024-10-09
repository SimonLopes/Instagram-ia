const fal = require('@fal-ai/serverless-client');

const key = 'b1cee4e3-1cff-4b7c-a1cd-74fc35468ee9:0ddfc0e17de3e90d4b0d58bc66164456';

fal.config({
    credentials: key,
});

module.exports = fal;