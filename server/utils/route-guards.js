/* globals require module */

const jwt = require('jsonwebtoken'),
    config = require('../config/env-variables');

module.exports = (data) => {
    return {
        isAdmin(token) {
            return new Promise((resolve, reject) => {
                if (token) {
                    let decoded = jwt.decode(token.split(' ')[1], config.jwtSecretKey);
                    const user = decoded._doc;
                    data.findUserById(user._id)
                        .then((resUser) => {
                            if (resUser && resUser.admin) {
                                return resolve(resUser);
                            }

                            return reject(new Error('Not authorized!'));
                        })
                        .catch(error => {
                            return reject(error);
                        });
                } else {
                    return reject(new Error('No authentication token received'));
                }
            });
        },
        isAuthorized(token, targetUserId) {
            return new Promise((resolve, reject) => {
                if (token) {
                    let decoded = jwt.decode(token.split(' ')[1], config.jwtSecretKey);
                    const user = decoded._doc;
                    data.findUserById(user._id)
                        .then((resUser) => {
                            if (resUser && (resUser.admin || resUser._id.toString() == targetUserId.toString())) {
                                return resolve(resUser);
                            }

                            return reject(new Error('Not authorized!'));
                        })
                        .catch(error => {
                            return reject(error);
                        });
                } else {
                    return reject(new Error('No authentication token received'));
                }
            });
        },
        isAuthenticated(token) {
            return new Promise((resolve, reject) => {
                if (token) {
                    let decoded = jwt.decode(token.split(' ')[1], config.jwtSecretKey);
                    const user = decoded._doc;
                    data.findUserById(user._id)
                        .then((resUser) => {
                            if (resUser) {
                                return resolve(resUser);
                            }

                            return reject(new Error('Not authorized!'));
                        })
                        .catch(error => {
                            return reject(error);
                        });
                } else {
                    return reject(new Error('No authentication token received'));
                }
            });
        }
    };
};