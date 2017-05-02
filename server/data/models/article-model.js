/* globals require module */

const mongoose = require('mongoose'),
    commentSchema = require('./comment-model').commentSchema,
    Schema = mongoose.Schema;

let articleSchema = new Schema({
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
        maxlength: 10000
    },
    tags: {
        type: [String]
    },
    sideA: {
        type: String,
        required: true
    },
    sideB: {
        type: String,
        required: true
    },
    injuredA: {
        type: [String],
        required: true
    },
    injuredB: {
        type: [String],
        required: true
    },
    lineupsA: {
        type: [String],
        required: true
    },
    lineupsB: {
        type: [String],
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    matchPrediction: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: new Date
    },
    comments: {
        type: [commentSchema]
    },
    likes: {
        type: [String]
    }
});

mongoose.model('article', articleSchema);
let Article = mongoose.model('article');

module.exports.Article = Article;