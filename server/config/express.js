/* globals require module process */

const express = require('express'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    handlebars = require('express-handlebars'),
    cors = require('cors');

let app = express();
app.use(cors());
app.use('/public', express.static('client'));
app.use('/libs', express.static('node_modules'));
app.use('/tests', express.static('tests'));
app.use('/build', express.static('build'));
app.use(cookieParser());
app.engine('handlebars', handlebars({}));
app.set('view engine', 'handlebars');
app.set('views', './server/views');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

module.exports = app;
