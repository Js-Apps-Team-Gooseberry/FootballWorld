/* globals module require __dirname */

const fs = require('fs'),
    path = require('path');

module.exports = (data) => {
    let dataExport = {};

    fs.readdirSync('./server/controllers')
        .filter(x => x.includes('-controller'))
        .forEach(controller => {
            let dataModule = require(path.join(__dirname, controller))(data);

            Object.keys(dataModule)
                .forEach(key => {
                    dataExport[key] = dataModule[key];
                });
        });

    return dataExport;
};