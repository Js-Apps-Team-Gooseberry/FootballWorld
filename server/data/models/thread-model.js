/* globals require module */

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let categories = require('../../utils/constants').forumCategories;

let threadSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    content: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 2000
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
    imageUrl: {
        type: String,
        required: true
    },
    tags: {
        type: [String]
    },
    category: {
        type: String,
        enum: categories
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isLocked: {
        type: Boolean,
        default: false
    },
    createdOn: {
        type: Date,
        default: new Date
    },
    posts: {
        type: []
    },
    likes: {
        type: [String]
    },
    dislikes: {
        type: [String]
    },
    lastPost: {
        author: String,
        userId: String,
        userAvatar: String
    },
    lastPostCreatedOn: {
        type: Date
    }
});

mongoose.model('thread', threadSchema);
let Thread = mongoose.model('thread');

module.exports.Thread = Thread;