const NodeGeocoder = require('node-geocoder');

const options = {
    provider: 'mapquest',
    httpAdapter: 'https',
    apiKey: 'SvBcMm7iJkZwHVhqAzdm6uWxFbE2SwJG',
    formatter: null
};

module.exports = NodeGeocoder(options);