/* globals module process */

let connectionString = {
    production: '',
    development: 'mongodb://localhost/football-world'
};

module.exports = {
    port: process.env.PORT || 3001,
    connectionString: connectionString[process.env.NODE_ENV || 'development'],
    jwtSecretKey: 'secret-as-shit'
};