/* globals module require */

const router = require('express').Router();

module.exports = function (app, data) {
    const controllers = require('../controllers/forum-controller')(data);

    router
        .get('/get-all-for-users/:category/:page', controllers.getNotDeletedThreadsByCategory)
        .get('/get-by-id/:id', controllers.getThreadById)
        .post('/create', controllers.createNewThread)
        .put('/edit-thread/:id', controllers.editThread)
        .post('/create-post/:id', controllers.createNewPost)
        .put('/flag-active/:id', controllers.flagThreadAsActive)
        .put('/flag-delete/:id', controllers.flagThreadAsDeleted)
        .delete('/delete-thread/:id', controllers.deleteThread)
        .put('/edit-post/:threadId/:postId', controllers.editPost)
        .delete('/delete-post/:threadId/:postId', controllers.deletePost)
        .put('/like-thread/:id', controllers.toggleLikeThread)
        .put('/like-post/:threadId/:postId', controllers.toggleLikePost)
        .put('/dislike-thread/:id', controllers.toggleDislikeThread)
        .put('/dislike-post/:threadId/:postId', controllers.toggleDisikePost);

    app.use('/api/forum', router);
};