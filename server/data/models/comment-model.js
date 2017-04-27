/* globals require module */

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let commentSchema = new Schema({
    author: {
        type: String,
        required: true
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
    },
    isDeleted: {
        type: Boolean
    }
});

mongoose.model('comment', commentSchema);
let Comment = mongoose.model('comment');

module.exports = { Comment, commentSchema };