/* globals module require */

const router = require('express').Router();

module.exports = function (app, data) {
    const controllers = require('../controllers/threads-controller')(data);

    router
        .get('/get-all-for-users/:category/:page', controllers.getNotDeletedThreadsByCategory)
        .get('/get-by-id/:id', controllers.getThreadById)
        .post('/create', controllers.createNewThread);

    app.use('/api/forum', router);
};