/* globals require module */

const express = require('express'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    morgan = require('morgan');

let app = express();
app.use('/public', express.static('client'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

module.exports = app;
