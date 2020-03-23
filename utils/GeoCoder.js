const NodeGeocoder = require('node-geocoder');

const options = {
    provider: 'mapquest',
    httpAdapter: 'https',
    apiKey: 'SvBcMm7iJkZwHVhqAzdm6uWxFbE2SwJG',
    formatter: null
};

console.log(options);
// const geocoder = NodeGeocoder(options);

module.exports = NodeGeocoder(options);