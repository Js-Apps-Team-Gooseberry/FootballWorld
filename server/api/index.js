/* globals module require __dirname */

const router = require('express').Router(),
    path = require('path');

module.exports = (app, data) => {
    router.get('*', (req, res) => {
        res.status(200).sendFile(path.join(__dirname + '/../../client/index.html'));
    });

    app.use(router);
};