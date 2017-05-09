/* globals module require */

const router = require('express').Router();

module.exports = function (app, data) {
    const controllers = require('../controllers/articles-controller')(data);

    router
        .get('/search/:page/:query', controllers.searchArticles)
        .post('/create', controllers.createNewArticle)
        .post('/get-all-not-deleted-articles', controllers.getNotDeletedArticlesByPage)
        .post('/get-by-id', controllers.getArticleById)
        .post('/comment', controllers.commentArticle)
        .put('/edit-article/:id', controllers.editArticle)
        .put('/flag-delete/:id', controllers.flagArticleAsDeleted)
        .put('/flag-active/:id', controllers.flagArticleAsActive)
        .get('/get-all-admin/:page/:query/:sort', controllers.getAllArticlesAdmin)
        .delete('/delete-comment', controllers.deleteComment)
        .delete('/delete-article/:id', controllers.permanentlyDeleteArticle);

    app.use('/api/articles', router);
};