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
    isDeleted: {
        type: Boolean,
        default: false
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