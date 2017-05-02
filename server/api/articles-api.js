/* globals module require */

const router = require('express').Router();

module.exports = function (app, data) {
    const controllers = require('../controllers/articles-controller')(data);

    router
        .post('/create', controllers.createNewArticle)
        .post('/get-all-not-deleted-articles', controllers.getNotDeletedArticlesByPage)
        .post('/get-by-id', controllers.getArticleById)
        .post('/comment', controllers.commentArticle)
        .delete('/delete-comment', controllers.deleteComment);

    app.use('/api/articles', router);
};