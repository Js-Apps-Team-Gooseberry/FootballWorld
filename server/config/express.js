/* globals require module */

const express = require('express'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');

let app = express();
app.use('/public', express.static('client'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

module.exports = app;
