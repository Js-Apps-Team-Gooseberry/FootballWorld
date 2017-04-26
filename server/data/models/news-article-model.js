/* globals require module */

const mongoose = require('mongoose'),
    Comment = require('./comment-model').Comment,
    Schema = mongoose.Schema;

let newsArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    imageUrl: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 5000
    },
    tags: {
        type: [String]
    },
    createdOn: {
        type: Date,
        default: new Date
    },
    comments: {
        type: [Comment]
    },
    likes: {
        type: [String]
    }
});

mongoose.model('news-article', newsArticleSchema);
let NewsArticle = mongoose.model('news-article');

module.exports.NewsArticle = NewsArticle;