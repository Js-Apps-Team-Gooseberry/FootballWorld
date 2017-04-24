/* globals module require */

const router = require('express').Router();

module.exports = function (app, data) {
    const controllers = require('../controllers/auth-controller')(data);

    router
        .post('/register', controllers.register)
        .put('/login', controllers.login);

    app.use('/api/auth', router);
};