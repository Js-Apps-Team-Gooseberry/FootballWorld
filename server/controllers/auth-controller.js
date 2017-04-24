/* globals module require */

const jwt = require('jsonwebtoken'),
    config = require('../config/env-variables');

module.exports = (data) => {
    return {
        register(req, res) {
            if (!req.body) {
                res.status(400).json({ message: 'Empty request received!' });
                return;
            }

            if (req.body.password.length < 6 || req.body.password.length > 15) {
                return res.status(400).json({ message: 'Password should be between 6 and 15 symbols!' });
            }

            data.findUserByCredentials(req.body.username)
                .then((user) => {
                    if (user) {
                        return res.status(409).json({ message: 'User already exist!' });
                    }

                    data.createUser(req.body.username, req.body.password, req.body.name, req.body.email, req.body.profilePicture)
                        .then(() => {
                            res.status(201).json({
                                message: `User ${req.body.username} succesfully created!`
                            });
                        })
                        .catch(error => {
                            res.status(400).json(error);
                        });
                })
                .catch(error => {
                    res.status(500).json(error);
                });
        },
        login(req, res, next) {
            let username = req.body.username,
                password = req.body.password;

            data.findUserByCredentials(username)
                .then(user => {
                    if (!user || !user.authenticate(password)) {
                        return res.status(401).json({
                            message: 'Incorrect username or password!'
                        });
                    }

                    if (user.isDeleted) {
                        return res.status(403).json({ message: 'User account blocked!' });
                    }

                    let token = jwt.sign(user, config.jwtSecretKey, {
                        expiresIn: 60 * 60 * 24 // 24 hours in seconds
                    });

                    let userToReturn = JSON.parse(JSON.stringify(user));
                    delete userToReturn.passHash;
                    delete userToReturn.salt;

                    res.status(200).json({
                        message: `User ${user.username} successfully logged in!`,
                        token: 'JWT ' + token,
                        user: userToReturn
                    });
                });
        },
        logout(req, res) {
            req.logout();
            return res.status(200).json({
                message: 'User successfully logged out!'
            });
        },
        checkLogin(req, res) {
            const token = req.headers.authorization;

            if (token) {
                let decoded = jwt.decode(token.split(' ')[1], config.jwtSecretKey);
                const user = decoded._doc;
                data.findUserById(user._id)
                    .then((resUser) => {
                        res.status(200).json(resUser);
                    })
                    .catch(err => {
                        res.status(500).json(err);
                    });
            } else {
                res.status(401).json({
                    message: 'Token auth failed!'
                });
            }
        },
        checkIfAdmin(req, res) {
            const token = req.headers.authorization;

            if (token) {
                let decoded = jwt.decode(token.split(' ')[1], config.jwtSecretKey);
                const user = decoded._doc;
                data.findUserById(user._id)
                    .then((resUser) => {
                        if (resUser && resUser.admin) {
                            return res.status(200).json(resUser);
                        }

                        res.status(401).json({ message: 'No such user or not an admin!' });
                    })
                    .catch(err => {
                        res.status(500).json(err);
                    });
            } else {
                res.status(401).json({
                    message: 'Token auth failed!'
                });
            }
        }
    };
};