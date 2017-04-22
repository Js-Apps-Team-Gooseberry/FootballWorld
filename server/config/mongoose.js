/* globals require module global */

const mongoose = require('mongoose');

module.exports = (config) => {
    mongoose.Promise = global.Promise;
    mongoose.connect(config.connectionString);

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', () => console.log('We are now connected to connected to: ' + config.connectionString));
};