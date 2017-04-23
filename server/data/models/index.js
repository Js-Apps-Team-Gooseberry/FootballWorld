/* globals require module __dirname */

const fs = require('fs'),
    path = require('path');

let dataExport = {};

fs.readdirSync(__dirname)
    .filter(x => x.includes('-model.js'))
    .forEach(data => {
        let dataModule = require(path.join(__dirname, data));

        Object.keys(dataModule)
            .forEach(key => {
                dataExport[key] = dataModule[key];
            });
    });

module.exports = dataExport;