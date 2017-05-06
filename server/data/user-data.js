/* globals module require */

const encryptor = require('../utils/encryptor'),
    pageCalculator = require('../utils/page-calculator');

module.exports = (models) => {
    const User = models.User;

    return {
        findUserByCredentials(username) {
            return new Promise((resolve, reject) => {
                User.findOne({ username: username }, (error, user) => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(user);
                });
            });
        },
        findUserById(userId) {
            return new Promise((resolve, reject) => {
                User
                    .findOne({ _id: userId }, (error, user) => {
                        if (error) {
                            return reject(error);
                        }

                        return resolve(user);
                    });
            });
        },
        createUser(username, password, email, profilePicture) {
            let salt = encryptor.generateSalt(),
                passHash = encryptor.generateHashedPassword(salt, password);

            if (profilePicture.trim() == '') {
                profilePicture = '/public/assets/default-user-photo.png';
            }

            let userObject = {
                username,
                email,
                salt,
                passHash,
                profilePicture
            };

            var user = new User(userObject);

            return new Promise((resolve, reject) => {
                user.save((error, dbUser) => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(dbUser);
                });
            });
        },
        getUserById(userId) {
            return new Promise((resolve, reject) => {
                User.findOne({ _id: userId }, (error, user) => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(user);
                });
            });
        },
        updateUserInfo(userId, username, email, isAdmin) {
            return new Promise((resolve, reject) => {
                User.findOne({ _id: userId }, (error, user) => {
                    if (error) {
                        return reject(error);
                    }

                    user.username = username;
                    user.email = email;
                    user.admin = isAdmin;
                    user.save((error, result) => {
                        if (error) {
                            return reject(error);
                        }

                        return resolve(result);
                    });
                });
            });
        },
        blockUser(userId) {
            return new Promise((resolve, reject) => {
                User.findOne({ _id: userId }, (error, user) => {
                    if (error) {
                        return reject(error);
                    } else if (!user) {
                        return reject(new Error('No such user!'));
                    }

                    user.isDeleted = true;
                    user.save((error, result) => {
                        return resolve(result);
                    });

                });
            });
        },
        unblockUser(userId) {
            return new Promise((resolve, reject) => {
                User.findOne({ _id: userId }, (error, user) => {
                    if (error) {
                        return reject(error);
                    } else if (!user) {
                        return reject(new Error('No such user!'));
                    }

                    user.isDeleted = false;
                    user.save((error, result) => {
                        return resolve(result);
                    });

                });
            });
        },
        getAllUsers(page, query, sort) {
            let pageSize = 10;

            let sortMethod = sort == 'status' ? { isDeleted: -1, registeredOn: -1 } : { registeredOn: -1 };
            let queryObj = query.trim() ? { username: { '$regex': query.trim(), '$options': 'i' } } : {};

            return new Promise((resolve, reject) => {
                User.find(queryObj)
                    .sort(sortMethod)
                    .skip((page - 1) * pageSize)
                    .limit(pageSize)
                    .exec((error, users) => {
                        if (error) {
                            return reject(error);
                        }

                        User.count(queryObj, (error, count) => {
                            if (error) {
                                return reject(error);
                            }

                            let pagesCount = pageCalculator.getPagesCount(count, pageSize);
                            let result = {
                                users,
                                pagesCount
                            };

                            return resolve(result);
                        });
                    });
            });
        },
        deleteUser(userId) {
            return new Promise((resolve, reject) => {
                User.findOneAndRemove({ _id: userId }, (error, result) => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(result);
                });
            });
        }
    };
};