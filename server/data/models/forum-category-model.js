/* globals require module */

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let forumCategorySchema = new Schema({
    title: {
        type: String,
        maxlength: 20,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    linkName: {
        type: String,
        required: true
    },
    lastPost: {
        author: String,
        thread: String,
        createdOn: Date
    },
    threads: {
        type: Number,
        default: 0
    },
    posts: {
        type: Number,
        default: 0
    }
});

mongoose.model('forum-category', forumCategorySchema);
let ForumCategory = mongoose.model('forum-category');

module.exports.ForumCategory = ForumCategory;