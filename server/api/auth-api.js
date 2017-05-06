/* globals module require */

const router = require('express').Router();

module.exports = function (app, data) {
    const controllers = require('../controllers/auth-controller')(data);

    router
        .post('/register', controllers.register)
        .get('/get-all/:page/:query/:sort', controllers.getAllUsers)
        .get('/get-by-id/:id', controllers.getById)
        .delete('/delete-user/:id', controllers.deleteUser)
        .put('/block-user/:id', controllers.blockUser)
        .put('/unblock-user/:id', controllers.unblockUser)
        .put('/update-user-info/:id', controllers.updateUserInfo)
        .put('/change-password/:id', controllers.changePassword)
        .put('/login', controllers.login);

    app.use('/api/auth', router);
};