/* globals module require */

const router = require('express').Router();

module.exports = function (app, data) {
    const controllers = require('../controllers/news-controller')(data);

    router
        .get('/get-all-for-users', controllers.getNewsForUsers);

    app.use('/api/news', router);
};