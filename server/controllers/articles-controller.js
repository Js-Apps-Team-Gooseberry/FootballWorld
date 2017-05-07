/* globals module require */

module.exports = (data) => {
    const routeGuards = require('../utils/route-guards')(data);

    return {
        createNewArticle(req, res) {
            let title = req.body.title;
            let imageUrl = req.body.imageUrl;
            let content = req.body.content;
            let createdOn = req.body.createdOn;
            let matchPrediction = req.body.matchPrediction;
            let sideA = req.body.sideA;
            let sideB = req.body.sideB;
            let lineupsA = req.body.lineupsA;
            let lineupsB = req.body.lineupsB;
            let injuredA = req.body.injuredA;
            let injuredB = req.body.injuredB;

            let token = req.headers.authorization;
            routeGuards.isAdmin(token)
                .catch(error => {
                    res.status(401).json('Unauthorized!');
                    return Promise.reject(error);
                })
                .then(user => {
                    return data.createNewArticle(title, user.username, imageUrl, content, matchPrediction, sideA, sideB, lineupsA, lineupsB, injuredA, injuredB, createdOn);
                })
                .then(newArticle => {
                    return res.status(201).json(newArticle);
                })
                .catch(error => {
                    return res.status(500).json(error);
                });
        },
        getNotDeletedArticlesByPage(req, res) {
            let page = req.body.page;
            let pageSize = req.body.pageSize;
            if (!page) {
                page = 1;
            }

            data.getNotDeletedArticlesByPage(page, pageSize)
                .then(response => {
                    return res.status(200).json(response);
                })
                .catch(error => {
                    return res.status(500).json(error);
                });
        },
        getArticleById(req, res) {
            let id = req.body.articleId;
            let token = req.headers.authorization;
            let isAdmin = false;

            routeGuards.isAdmin(token)
                .then(() => isAdmin = true)
                .catch(() => isAdmin = false)
                .then(() => {
                    return data.getArticleById(id);
                })
                .then(article => {
                    let predicate = isAdmin ? !article : (!article || article.isDeleted);
                    if (predicate) {
                        return res.status(404).json({ message: 'Not found!' });
                    }

                    return res.status(200).json(article);
                })
                .catch(error => {
                    return res.status(500).json(error);
                });
        },
        commentArticle(req, res) {
            let articleId = req.body.articleId;
            let content = req.body.commentContent;
            let token = req.headers.authorization;

            routeGuards.isAuthenticated(token)
                .catch(error => {
                    res.status(401).json('Unauthorized!');
                    return Promise.reject(error);
                })
                .then(user => {
                    return data.commentArticle(articleId, user._id, content);
                })
                .then(response => {
                    return res.status(201).json(response);
                })
                .catch(error => {
                    console.log(error);
                    return res.status(500).json(error);
                });
        },
        deleteComment(req, res) {
            let articleId = req.body.articleId;
            let commentId = req.body.commentId;
            let token = req.headers.authorization;

            data.getArticleById(articleId)
                .then(article => {
                    if (!article || !article.comments) {
                        return res.status(400).json('No such article or comment!');
                    }

                    let comment = article.comments.find(x => x._id.toString() == commentId);
                    if (!comment) {
                        return res.status(400).json('No such article or comment!');
                    }

                    return routeGuards.isAuthorized(token, comment.author.userId);
                })
                .catch(error => {
                    res.status(404).json('Unauthorized!');
                    return Promise.reject(error);
                })
                .then(() => {
                    return data.deleteArticleComment(articleId, commentId);
                })
                .then(response => {
                    return res.status(200).json(response);
                })
                .catch(error => {
                    return res.status(500).json(error);
                });
        },
        flagArticleAsDeleted(req, res) {
            let token = req.headers.authorization;
            let id = req.params.id;

            routeGuards.isAdmin(token)
                .catch(error => {
                    res.status(401).json('Unauthorized!');
                    return Promise.reject(error);
                })
                .then(() => {
                    return data.flagArticleAsDeleted(id);
                })
                .then(response => {
                    return res.status(200).json(response);
                })
                .catch(error => {
                    return res.status(500).json(error);
                });
        },
        flagArticleAsActive(req, res) {
            let token = req.headers.authorization;
            let id = req.params.id;

            routeGuards.isAdmin(token)
                .catch(error => {
                    res.status(401).json('Unauthorized!');
                    return Promise.reject(error);
                })
                .then(() => {
                    return data.flagArticleAsActive(id);
                })
                .then(response => {
                    return res.status(200).json(response);
                })
                .catch(error => {
                    return res.status(500).json(error);
                });
        },
        permanentlyDeleteArticle(req, res) {
            let token = req.headers.authorization;
            let id = req.params.id;

            routeGuards.isAdmin(token)
                .catch(error => {
                    res.status(401).json('Unauthorized!');
                    return Promise.reject(error);
                })
                .then(() => {
                    return data.permanentlyDeleteArticle(id);
                })
                .then(response => {
                    return res.status(200).json(response);
                })
                .catch(error => {
                    return res.status(500).json(error);
                });
        },
        editArticle(req, res) {
            let token = req.headers.authorization;
            let id = req.params.id;
            let title = req.body.title;
            let imageUrl = req.body.imageUrl;
            let content = req.body.content;
            let matchPrediction = req.body.matchPrediction;
            let sideA = req.body.sideA;
            let sideB = req.body.sideB;
            let lineupsA = req.body.lineupsA;
            let lineupsB = req.body.lineupsB;
            let injuredA = req.body.injuredA;
            let injuredB = req.body.injuredB;

            routeGuards.isAdmin(token)
                .catch(error => {
                    res.status(401).json('Unauthorized!');
                    return Promise.reject(error);
                })
                .then(() => {
                    return data.editArticle(id, title, imageUrl, content, matchPrediction, sideA, sideB, lineupsA, lineupsB, injuredA, injuredB);
                })
                .then(response => {
                    return res.status(200).json(response);
                })
                .catch(error => {
                    return res.status(500).json(error);
                });
        },
        getAllArticlesAdmin(req, res) {
            let token = req.headers.authorization;
            let page = +req.params.page;
            let query = req.params.query == '!-!' ? '' : req.params.query;
            let sort = req.params.sort;

            routeGuards.isAdmin(token)
                .catch(error => {
                    res.status(401).json(error);
                    return Promise.reject(error);
                })
                .then(() => {
                    return data.getAllArticlesAdmin(page, query, sort);
                })
                .then(articles => {
                    return res.status(200).json(articles);
                })
                .catch(error => {
                    return res.status(500).json(error);
                });
        }
    };
};