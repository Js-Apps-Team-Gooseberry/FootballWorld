/* globals module require */

const encryptor = require('../utils/encryptor');

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
            console.log(isAdmin);
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
        }
    };
};