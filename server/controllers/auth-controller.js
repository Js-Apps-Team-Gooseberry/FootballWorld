/* globals module require */

const jwt = require('jsonwebtoken'),
    config = require('../config/env-variables');

function getJwtToken(user, secretOrKey) {
    let token = jwt.sign(user, secretOrKey, {
        expiresIn: 60 * 60 * 24 // 24 hours in seconds
    });

    return token;
}

function cloneUser(user) {
    let userToReturn = JSON.parse(JSON.stringify(user));
    delete userToReturn.passHash;
    delete userToReturn.salt;

    return userToReturn;
}

module.exports = (data) => {
    const routeGuards = require('../utils/route-guards')(data);

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

                    data.createUser(req.body.username, req.body.password, req.body.email, req.body.profilePicture)
                        .then(newUser => {
                            let token = getJwtToken(newUser, config.jwtSecretKey);
                            let userToReturn = cloneUser(newUser);
                            res.status(201).json({
                                message: `User ${req.body.username} succesfully created!`,
                                token: 'JWT ' + token,
                                user: userToReturn
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

                    let token = getJwtToken(user, config.jwtSecretKey);
                    let userToReturn = cloneUser(user);

                    res.status(200).json({
                        message: `User ${user.username} successfully logged in!`,
                        token: 'JWT ' + token,
                        user: userToReturn
                    });
                })
                .catch(error => res.status(500).json(error));
        },
        getById(req, res) {
            let id = req.params.id;
            let token = req.headers.authorization;
            let isAdmin = false;

            routeGuards.isAdmin(token)
                .then(() => isAdmin = true)
                .catch(() => isAdmin = false)
                .then(() => {
                    return data.getUserById(id);
                })
                .then(user => {
                    let predicate = isAdmin ? !user : (!user || user.isDeleted);
                    if (predicate) {
                        return res.status(404).json('No such user found!');
                    }

                    let clonedUser = cloneUser(user);

                    return res.status(200).json(clonedUser);
                })
                .catch(error => {
                    console.log(error);
                    return res.status(500).json(error);
                });
        },
        updateUserInfo(req, res) {
            let id = req.params.id;
            let username = req.body.username;
            let email = req.body.email;
            let isAdmin = req.body.isAdmin;

            data.getUserById(id)
                .then(user => {
                    if (!user) {
                        res.status(404).json('No such user found!');
                        return Promise.reject(new Error('No such user found!'));
                    }

                    let token = req.headers.authorization;

                    return routeGuards.isAuthorized(token, user._id);
                })
                .catch(error => {
                    res.status(401).json(error);
                })
                .then(user => {
                    if (!user.admin) {
                        isAdmin = false;
                    }

                    return data.updateUserInfo(id, username, email, isAdmin);
                })
                .then(response => {
                    let clonedUser = cloneUser(response);
                    return res.status(200).json(clonedUser);
                })
                .catch(error => {
                    return res.status(500).json(error);
                });
        },
        blockUser(req, res) {
            let token = req.headers.authorization;
            let userId = req.params.id;

            routeGuards.isAdmin(token)
                .catch(error => {
                    res.status(401).json(error);
                    return Promise.reject(error);
                })
                .then(() => {
                    return data.blockUser(userId);
                })
                .then(user => {
                    let clonedUser = cloneUser(user);
                    return res.status(200).json(clonedUser);
                })
                .catch(error => {
                    return res.status(500).json(error);
                });
        },
        unblockUser(req, res) {
            let token = req.headers.authorization;
            let userId = req.params.id;

            routeGuards.isAdmin(token)
                .catch(error => {
                    res.status(401).json(error);
                    return Promise.reject(error);
                })
                .then(() => {
                    return data.unblockUser(userId);
                })
                .then(user => {
                    let clonedUser = cloneUser(user);
                    return res.status(200).json(clonedUser);
                })
                .catch(error => {
                    return res.status(500).json(error);
                });
        },
        getAllUsers(req, res) {
            let token = req.headers.authorization;
            let page = +req.params.page;
            let query = req.params.query == '!-!' ? '' : req.params.query;
            let sort = req.params.sort;

            routeGuards.isAdmin(token)
                .catch(error => {
                    res.status(401).json('Unauthorized!');
                    return Promise.reject(error);
                })
                .then(() => {
                    return data.getAllUsers(page, query, sort);
                })
                .then(response => {
                    console.log(response);
                    response.users = response.users.map(cloneUser);
                    return res.status(200).json(response);
                })
                .catch(error => {
                    console.log(error);
                    return res.status(500).json(error);
                });
        },
        deleteUser(req, res) {
            let token = req.headers.authorization;
            let targetId = req.params.id;

            routeGuards.isAdmin(token)
                .catch(error => {
                    res.status(401).json('Unauthorized!');
                    return Promise.reject(error);
                })
                .then(() => {
                    return data.deleteUser(targetId);
                })
                .then(response => {
                    return res.status(200).json(`User ${response.username} removed permanently!`);
                })
                .catch(error => {
                    return res.status(500).json(error);
                });
        }
    };
};