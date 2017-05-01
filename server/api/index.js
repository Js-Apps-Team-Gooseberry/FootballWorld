/* globals module require __dirname */

const router = require('express').Router(),
    fs = require('fs'),
    path = require('path');

module.exports = (app, data) => {
    fs.readdirSync(__dirname)
        .filter(x => x.includes('-api'))
        .forEach(api => require(path.join(__dirname, api))(app, data));

    router.get('*', (req, res) => {
        let userAgent = req.headers['user-agent'];

        if (/^(facebookexternalhit)/gi.test(userAgent)) {
            if (req.url.indexOf('news') > - 1) {
                let id = req.url.split('/').map(x => x.trim()).filter(x => x != '')[1];
                data.getNewsEntryById(id)
                    .then(article => {
                        res.render('bots', article);
                    });
            }
        } else {
            res.status(200).sendFile(path.join(__dirname + '/../../client/index.html'));
        }
    });

    app.use(router);
};