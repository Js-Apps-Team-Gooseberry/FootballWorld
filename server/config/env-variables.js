/* globals module process */

let connectionString = {
    production: process.env.CONNECTION_STRING,
    development: 'mongodb://localhost/tsar-football'
};

module.exports = {
    port: process.env.PORT || 3001,
    connectionString: connectionString[process.env.NODE_ENV || 'development'],
    jwtSecretKey: process.env.SECRET_KEY || 'secret-as-shit'
};