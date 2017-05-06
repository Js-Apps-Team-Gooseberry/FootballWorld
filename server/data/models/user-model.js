/* globals require module */

const mongoose = require('mongoose'),
    encryptor = require('../../utils/encryptor'),
    Schema = mongoose.Schema;

let userSchema = new Schema({
    username: {
        type: String,
        minlength: 5,
        maxlength: 15,
        unique: true,
        required: true
    },
    passHash: String,
    salt: String,
    email: String,
    profilePicture: {
        type: String,
        default: '/public/assets/default-user-photo.png'
    },
    registeredOn: {
        type: Date,
        default: Date.now
    },
    forumPosts: {
        type: Number,
        default: 0
    },
    isDeleted: Boolean,
    admin: Boolean
});

userSchema.method({
    authenticate(password) {
        if (encryptor.generateHashedPassword(this.salt, password) === this.passHash) {
            return true;
        }

        return false;
    }
});

mongoose.model('user', userSchema);
let User = mongoose.model('user');

module.exports.User = User;