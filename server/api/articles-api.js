/* globals module require */

const router = require('express').Router();

module.exports = function (app, data) {
    const controllers = require('../controllers/articles-controller')(data);

    router
        .post('/create', controllers.createNewArticle)
        .post('/get-all-not-deleted-articles', controllers.getNotDeletedArticlesByPage)
        .post('/get-by-id', controllers.getArticleById);

    app.use('/api/articles', router);
};