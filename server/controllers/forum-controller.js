/* globals module require */

module.exports = (data) => {
    const routeGuards = require('../utils/route-guards')(data),
        categories = require('../utils/constants').forumCategories;

    return {
        createNewThread(req, res) {
            let token = req.headers.authorization;

            routeGuards.isAuthenticated(token)
                .catch(error => {
                    res.status(401).json('You need to be signed in to create a thread!');
                    return Promise.reject(error);
                })
                .then(user => {
                    let title = req.body.title;
                    let content = req.body.content;
                    let imageUrl = req.body.imageUrl;
                    let category = req.body.category;
                    let tags = req.body.tags;

                    return data.createNewThread(title, content, imageUrl, category, tags, user._id, user.username, user.profilePicture);
                })
                .then(response => {
                    return res.status(201).json(response);
                })
                .catch(error => {
                    return res.status(500).json(error);
                });
        },
        getNotDeletedThreadsByCategory(req, res) {
            let page = +req.params.page;
            let category = req.params.category.trim();
            if (categories.every(c => c != category)) {
                return res.status(404).json('No such category');
            }

            data.getNotDeletedThreadsByCategory(category, page)
                .then(threads => {
                    return res.status(200).json(threads);
                })
                .catch(error => {
                    return res.status(500).json(error);
                });
        },
        getThreadById(req, res) {
            let token = req.headers.authorization;
            let id = req.params.id;
            let isAdmin = false;

            routeGuards.isAdmin(token)
                .then(() => isAdmin = true)
                .catch(() => isAdmin = false)
                .then(() => {
                    return data.getThreadById(id);
                })
                .then(thread => {
                    let predicate = isAdmin ? !thread : (!thread || thread.isDeleted);
                    if (predicate) {
                        return res.status(404).json('No such thread!');
                    }

                    return res.status(200).json(thread);
                })
                .catch(error => {
                    return res.status(500).json(error);
                });
        },
        createNewPost(req, res) {
            let token = req.headers.authorization;
            let id = req.params.id;
            let content = req.body.content;

            routeGuards.isAuthenticated(token)
                .catch(error => {
                    res.status(401).json(error);
                    return Promise.reject(error);
                })
                .then(user => {
                    return data.createNewPost(id, content, user.username, user._id, user.profilePicture);
                })
                .then(response => {
                    return res.status(201).json(response);
                })
                .catch(error => {
                    return res.status(500).json(error);
                });
        },
        editThread(req, res) {
            let threadId = req.params.id;

            data.getThreadByIdWithoutRecordingViews(threadId)
                .then(thread => {
                    if (!thread) {
                        return res.status(404).json('No such thread found!');
                    }

                    let token = req.headers.authorization;

                    return routeGuards.isAuthorized(token, thread.author.userId);
                })
                .catch(error => {
                    res.status(401).json('Unauthorized');
                    return Promise.reject(error);
                })
                .then(() => {
                    let title = req.body.title;
                    let content = req.body.content;
                    let imageUrl = req.body.imageUrl;
                    let category = req.body.category;
                    let tags = req.body.tags;

                    if (!categories.includes(category)) {
                        return res.status(404).json('No such category found!');
                    }

                    return data.editThread(threadId, title, content, imageUrl, category, tags);
                })
                .then(result => {
                    return res.status(200).json(result);
                })
                .catch(error => {
                    return res.status(500).json(error);
                });
        }
    };
};
