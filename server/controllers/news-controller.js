/* globals module require */

module.exports = (data) => {
    const routeGuards = require('../utils/route-guards')(data);

    return {
        createNewNewsEntry(req, res) {
            let token = req.headers.authorization;

            routeGuards.isAdmin(token)
                .catch(error => {
                    res.status(401).json('Unauthorized!');
                    return Promise.reject(error);
                })
                .then((user) => {
                    let title = req.body.title;
                    let description = req.body.description;
                    let author = user.username;
                    let imageUrl = req.body.imageUrl;
                    let content = req.body.content;
                    let tags = req.body.tags;
                    let createdOn = req.body.createdOn;

                    return data.createNewNewsEntry(title, description, author, imageUrl, content, tags, createdOn);
                })
                .then(newArticle => {
                    return res.status(201).json(newArticle);
                })
                .catch(error => {
                    return res.status(500).json(error);
                });
        },
        getNewsForUsers(req, res) {
            let page = req.headers.page;
            let pageSize = req.headers.pagesize;
            if (!page) {
                page = 1;
            }

            data.getNotDeletedNewsEntriesByPage(page, pageSize)
                .then(response => {
                    return res.status(200).json(response);
                })
                .catch(error => {
                    return res.status(500).json(error);
                });
        },
        getNewsEntryById(req, res) {
            let token = req.headers.authorization;
            let id = req.body.newsEntryId;
            let isAdmin = false;

            routeGuards.isAdmin(token)
                .then(() => isAdmin = true)
                .catch(() => isAdmin = false)
                .then(() => {
                    return data.getNewsEntryById(id);
                })
                .then(newsEntry => {
                    let predicate = isAdmin ? !newsEntry : (!newsEntry || newsEntry.isDeleted);
                    if (predicate) {
                        return res.status(404).json({ message: 'Not found!' });
                    }

                    return res.status(200).json(newsEntry);
                })
                .catch(error => {
                    return res.status(500).json(error);
                });
        },
        getNewsByTags(req, res) {
            let tags = req.body.tags;
            let currentArticle = req.body.currentArticle;
            let articlesCount = req.body.articlesCount;

            data.getNewsByTags(tags, currentArticle, articlesCount)
                .then(response => {
                    return res.status(200).json(response);
                })
                .catch(error => {
                    return res.status(500).json(error);
                });
        },
        getLatestAsideNewsEntries(req, res) {
            let articlesCount = req.body.articlesCount;
            let currentArticleId = req.body.currentArticleId;
            data.getLatestAsideNewsEntries(articlesCount, currentArticleId)
                .then(newsEntries => {
                    return res.status(200).json(newsEntries);
                })
                .catch(error => {
                    return res.status(500).json(error);
                });
        },
        editNewsEntry(req, res) {
            let token = req.headers.authorization;

            routeGuards.isAdmin(token)
                .catch(error => {
                    res.status(401).json('Unauthorized!');
                    return Promise.reject(error);
                })
                .then(() => {
                    let id = req.body.articleId;
                    let title = req.body.title;
                    let description = req.body.description;
                    let imageUrl = req.body.imageUrl;
                    let content = req.body.content;
                    let tags = req.body.tags;

                    return data.editNewsEntry(id, title, description, imageUrl, content, tags);
                })
                .then((response) => {
                    return res.status(200).json(response);
                })
                .catch(error => {
                    return res.status(500).json(error);
                });
        },
        flagNewsEntryAsDeleted(req, res) {
            let token = req.headers.authorization;

            routeGuards.isAdmin(token)
                .catch(error => {
                    res.status(401).json('Unauthorized!');
                    return Promise.reject(error);
                })
                .then(() => {
                    let id = req.body.articleId;

                    return data.flagNewsEntryAsDeleted(id);
                })
                .then(response => {
                    return res.status(200).json(response);
                })
                .catch(error => {
                    return res.status(500).json(error);
                });
        },
        commentNewsEntry(req, res) {
            let newsEntryId = req.body.newsEntryId;
            let userId = req.body.userId;
            let content = req.body.commentContent;

            data.commentNewsEntry(newsEntryId, userId, content)
                .then(response => {
                    return res.status(201).json(response);
                })
                .catch(error => {
                    return res.status(500).json(error);
                });
        },
        deleteNewsEntryComment(req, res) {
            let token = req.headers.authorization;
            let newsEntryId = req.body.newsEntryId;
            let commentId = req.body.commentId;

            data.getNewsEntryById(newsEntryId)
                .then(newsEntry => {
                    if (!newsEntry) {
                        res.status(400).json('No such article found!');
                        return Promise.reject(new Error('No such article found!'));
                    }

                    let comment = newsEntry.comments.find(c => c._id.toString() == commentId);
                    if (!comment) {
                        res.status(400).json('No such comment found!');
                        return Promise.reject(new Error('No such comment found!'));
                    }

                    let targetUserId = comment.author.userId;
                    return routeGuards.isAuthorized(token, targetUserId);
                })
                .catch(error => {
                    res.status(401).json('Unauthorized!');
                    return Promise.reject(error);
                })
                .then(() => {
                    return data.deleteNewsEntryComment(newsEntryId, commentId);
                })
                .then(response => {
                    return res.status(200).json(response);
                })
                .catch(error => {
                    return res.status(500).json(error);
                });
        },
        getNewsForAdmins(req, res) {
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
                    return data.getAllNews(page, query, sort);
                })
                .then(newsEntries => {
                    return res.status(200).json(newsEntries);
                })
                .catch(error => {
                    return res.status(500).json(error);
                });
        },
        flagNewsEntryAsActive(req, res) {
            let token = req.headers.authorization;

            routeGuards.isAdmin(token)
                .catch(error => {
                    res.status(401).json('Unauthorized!');
                    return Promise.reject(error);
                })
                .then(() => {
                    let id = req.params.id;
                    return data.flagNewsEntryAsActive(id);
                })
                .then(response => {
                    return res.status(200).json(response);
                })
                .catch(error => {
                    return res.status(500).json(error);
                });
        },
        deleteEntryPermanently(req, res) {
            let token = req.headers.authorization;

            routeGuards.isAdmin(token)
                .catch(error => {
                    res.status(401).json('Unauthorized!');
                    return Promise.reject(error);
                })
                .then(() => {
                    let id = req.params.id;
                    return data.deleteNewsEntry(id);
                })
                .then(response => {
                    return res.status(200).json(response);
                })
                .catch(error => {
                    return res.status(500).json(error);
                });
        }
    };
};