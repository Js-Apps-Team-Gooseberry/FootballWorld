/* globals module require */

const router = require('express').Router();

module.exports = function (app, data) {
    const controllers = require('../controllers/news-controller')(data);

    router
        .get('/get-all-for-users', controllers.getNewsForUsers)
        .post('/get-by-id', controllers.getNewsEntryById)
        .post('/get-aside-latest', controllers.getLatestAsideNewsEntries)
        .post('/get-by-tag', controllers.getNewsByTags);

    app.use('/api/news', router);
};