/* globals require module */

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let postSchema = new Schema({
    content: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1400
    },
    author: {
        username: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        },
        userAvatar: {
            type: String
        }
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdOn: {
        type: Date,
        default: new Date
    },
    likes: {
        type: [String]
    },
    dislikes: {
        type: [String]
    },
    updatedOn: {
        type: Date
    }
});

mongoose.model('post', postSchema);
let Post = mongoose.model('post');

module.exports = { postSchema, Post };