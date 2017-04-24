/* globals module require __dirname */

const router = require('express').Router(),
    fs = require('fs'),
    path = require('path');

module.exports = (app, data) => {
    fs.readdirSync(__dirname)
        .filter(x => x.includes('-api'))
        .forEach(api => require(path.join(__dirname, api))(app, data));

    router.get('*', (req, res) => {
        res.status(200).sendFile(path.join(__dirname + '/../../client/index.html'));
    });

    app.use(router);
};