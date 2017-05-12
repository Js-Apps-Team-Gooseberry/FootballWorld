/* globals module require */

const router = require('express').Router();

module.exports = function (app, data) {
    const controllers = require('../controllers/news-controller')(data);

    router
        .get('/search/:page/:query', controllers.searchNews)
        .get('/get-all-for-users/:page/:pageSize', controllers.getNewsForUsers)
        .post('/create', controllers.createNewNewsEntry)
        .post('/get-by-id', controllers.getNewsEntryById)
        .post('/get-aside-latest', controllers.getLatestAsideNewsEntries)
        .post('/get-by-tag', controllers.getNewsByTags)
        .put('/edit', controllers.editNewsEntry)
        .put('/flag-delete', controllers.flagNewsEntryAsDeleted)
        .post('/comment', controllers.commentNewsEntry)
        .delete('/delete-comment', controllers.deleteNewsEntryComment)
        .delete('/delete-entry/:id', controllers.deleteEntryPermanently)
        .get('/get-all-admin/:page/:query/:sort', controllers.getNewsForAdmins)
        .put('/flag-active/:id', controllers.flagNewsEntryAsActive);

    app.use('/api/news', router);
};