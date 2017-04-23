/* globals module process */

let connectionString = {
    production: '',
    development: 'mongodb://localhost/tsar-football'
};

module.exports = {
    port: process.env.PORT || 3001,
    connectionString: connectionString[process.env.NODE_ENV || 'development'],
    jwtSecretKey: 'secret-as-shit'
};