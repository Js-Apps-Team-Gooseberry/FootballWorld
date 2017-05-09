/* globals module require */

const pageCalculator = require('../utils/page-calculator');

module.exports = (models) => {
    const Article = models.Article,
        User = models.User,
        Comment = models.Comment;

    return {
        createNewArticle(title, author, imageUrl, content, matchPrediction, sideA, sideB, lineupsAStr, lineupsBStr, injuredAStr, injuredBStr) {
            return new Promise((resolve, reject) => {
                let createdOn = new Date();
                let lineupsA = lineupsAStr.split(',').map(x => x.trim()).filter(x => x != '');
                let lineupsB = lineupsBStr.split(',').map(x => x.trim()).filter(x => x != '');
                let injuredA = injuredAStr.split(',').map(x => x.trim()).filter(x => x != '');
                let injuredB = injuredBStr.split(',').map(x => x.trim()).filter(x => x != '');
                let tags = [sideA, sideB];

                let newArticle = new Article({ title, author, imageUrl, content, tags, matchPrediction, sideA, sideB, lineupsA, lineupsB, injuredA, injuredB, createdOn });

                newArticle.save((error, dbArticle) => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(dbArticle);
                });
            });
        },
        getNotDeletedArticlesByPage(page, pageSize) {
            pageSize = +pageSize;
            return new Promise((resolve, reject) => {
                Article.find({})
                    .where({ isDeleted: false })
                    .sort({ createdOn: -1 })
                    .skip((page - 1) * pageSize)
                    .limit(pageSize)
                    .exec((error, dbArticles) => {
                        if (error) {
                            return reject(error);
                        }

                        Article.count((error, count) => {
                            if (error) {
                                return reject(error);
                            }

                            let pagesCount = pageCalculator.getPagesCount(count, pageSize);
                            let articles = {
                                articles: dbArticles,
                                pagesCount
                            };

                            return resolve(articles);
                        });
                    });
            });
        },
        getArticleById(id) {
            return new Promise((resolve, reject) => {
                Article.findOne({ _id: id }, (error, article) => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(article);
                });
            });
        },
        commentArticle(articleId, userId, commentContent) {
            return new Promise((resolve, reject) => {
                Article.findOne({ _id: articleId }, (error, article) => {
                    if (error) {
                        return reject(error);
                    } else if (!article) {
                        return reject({ message: 'No such article found!' });
                    }

                    User.findOne({ _id: userId }, (error, user) => {
                        if (error) {
                            return reject(error);
                        } else if (!user) {
                            return reject({ message: 'You are not authorized to comment!' });
                        }

                        let createdOn = new Date();
                        let comment = new Comment({ author: { username: user.username, userId: user._id, userAvatar: user.profilePicture }, content: commentContent, createdOn });
                        article.comments.push(comment);
                        article.save((error, result) => {
                            if (error) {
                                return reject(error);
                            }

                            return resolve(result);
                        });
                    });
                });
            });
        },
        deleteArticleComment(articleId, commentId) {
            return new Promise((resolve, reject) => {
                Article.findOne({ _id: articleId }, (error, article) => {
                    if (error) {
                        return reject(error);
                    } else if (!article) {
                        return reject({ message: 'No such article found!' });
                    }

                    let comment = article.comments.find(x => x._id == commentId);
                    let index = article.comments.indexOf(comment);

                    if (index < 0) {
                        return reject({ message: 'No such comment found!' });
                    }

                    article.comments.splice(index, 1);
                    article.save((error, result) => {
                        if (error) {
                            return reject(error);
                        }

                        return resolve(result);
                    });
                });
            });
        },
        flagArticleAsDeleted(articleId) {
            return new Promise((resolve, reject) => {
                Article.update({ _id: articleId }, { $set: { isDeleted: true } }, (error, result) => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(result);
                });
            });
        },
        flagArticleAsActive(articleId) {
            return new Promise((resolve, reject) => {
                Article.update({ _id: articleId }, { $set: { isDeleted: false } }, (error, result) => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(result);
                });
            });
        },
        permanentlyDeleteArticle(articleId) {
            return new Promise((resolve, reject) => {
                Article.findOneAndRemove({ _id: articleId }, (error, result) => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(result);
                });
            });
        },
        editArticle(articleId, title, imageUrl, content, matchPrediction, sideA, sideB, lineupsAStr, lineupsBStr, injuredAStr, injuredBStr) {
            return new Promise((resolve, reject) => {
                let lineupsA = lineupsAStr.split(',').map(x => x.trim()).filter(x => x != '');
                let lineupsB = lineupsBStr.split(',').map(x => x.trim()).filter(x => x != '');
                let injuredA = injuredAStr.split(',').map(x => x.trim()).filter(x => x != '');
                let injuredB = injuredBStr.split(',').map(x => x.trim()).filter(x => x != '');
                let tags = [sideA, sideB];

                Article.findOne({ _id: articleId }, (error, article) => {
                    if (error) {
                        return reject(error);
                    }

                    article.title = title;
                    article.imageUrl = imageUrl;
                    article.content = content;
                    article.matchPrediction = matchPrediction;
                    article.sideA = sideA;
                    article.sideB = sideB;
                    article.lineupsA = lineupsA;
                    article.lineupsB = lineupsB;
                    article.injuredA = injuredA;
                    article.injuredB = injuredB;
                    article.tags = tags;

                    article.save((error, result) => {
                        if (error) {
                            return reject(error);

                        }
                        return resolve(result);
                    });
                });
            });
        },
        getAllArticlesAdmin(page, query, sort) {
            let pageSize = 10;

            let sortMethod = sort == 'status' ? { isDeleted: -1, createdOn: -1 } : { createdOn: -1 };
            let queryObj = query.trim() ? { title: { '$regex': query.trim(), '$options': 'i' } } : {};

            return new Promise((resolve, reject) => {
                Article.find(queryObj)
                    .sort(sortMethod)
                    .skip((page - 1) * pageSize)
                    .limit(pageSize)
                    .exec((error, articles) => {
                        if (error) {
                            return reject(error);
                        }

                        Article.count(queryObj, (error, count) => {
                            if (error) {
                                return reject(error);
                            }

                            let pagesCount = pageCalculator.getPagesCount(count, pageSize);
                            let news = {
                                articles,
                                pagesCount
                            };

                            return resolve(news);
                        });
                    });
            });
        },
        searchArticles(page, query) {
            const pageSize = 5;

            let queryObj = query.trim() ? { title: { '$regex': query.trim(), '$options': 'i' } } : {};

            return new Promise((resolve, reject) => {
                Article.find(queryObj)
                    .where({ isDeleted: false })
                    .sort({ createdOn: -1 })
                    .skip((page - 1) * pageSize)
                    .limit(pageSize)
                    .exec((error, articles) => {
                        if (error) {
                            return reject(error);
                        }

                        Article.count(queryObj, (error, count) => {
                            if (error) {
                                return reject(error);
                            }

                            let pagesCount = pageCalculator.getPagesCount(count, pageSize);
                            let data = {
                                articles,
                                pagesCount
                            };

                            return resolve(data);
                        });
                    });
            });
        }
    };
};