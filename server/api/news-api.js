/* globals module require */

const router = require('express').Router();

module.exports = function (app, data) {
    const controllers = require('../controllers/news-controller')(data);

    router
        .get('/get-all-for-users', controllers.getNewsForUsers)
        .post('/create', controllers.createNewNewsEntry)
        .post('/get-by-id', controllers.getNewsEntryById)
        .post('/get-aside-latest', controllers.getLatestAsideNewsEntries)
        .post('/get-by-tag', controllers.getNewsByTags)
        .put('/edit', controllers.editNewsEntry)
        .put('/flag-delete', controllers.flagNewsEntryAsDeleted);

    app.use('/api/news', router);
};