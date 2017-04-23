/* globals module process */

// from mongo shell ---> mongo ds115131.mlab.com:15131/tsar-football -u admin -p psithirikardias

let connectionString = {
    production: 'mongodb://admin:psithirikardias@ds115131.mlab.com:15131/tsar-football',
    development: 'mongodb://localhost/tsar-football'
};

module.exports = {
    port: process.env.PORT || 3001,
    connectionString: connectionString[process.env.NODE_ENV || 'development'],
    jwtSecretKey: 'secret-as-shit'
};