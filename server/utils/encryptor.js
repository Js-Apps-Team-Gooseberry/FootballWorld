/* globals require module */

const crypto = require('crypto');

module.exports = {
    generateSalt() {
        return crypto.randomBytes(128).toString('base64');
    },
    generateHashedPassword(salt, password) {
        var hmac = crypto.createHmac('sha1', salt);
        
        return hmac.update(password).digest('hex');
    }
};