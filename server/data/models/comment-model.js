/* globals require module */

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let commentSchema = new Schema({
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
    content: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 500
    },
    createdOn: {
        type: Date,
        default: new Date
    }
});

mongoose.model('comment', commentSchema);
let Comment = mongoose.model('comment');

module.exports = { Comment, commentSchema };