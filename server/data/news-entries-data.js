/* globals module require */

const pageCalculator = require('../utils/page-calculator');

module.exports = (models) => {
    const NewsEntry = models.NewsEntry,
        Comment = models.Comment,
        User = models.User;

    return {
        createNewNewsEntry(title, description, author, imageUrl, content, tagsStr, createdOn) {
            return new Promise((resolve, reject) => {
                if (createdOn == null) {
                    createdOn = new Date();
                }

                if (author == null) {
                    author = 'Jack London';
                }

                let tags = tagsStr.split(',').filter(t => t.trim() !== '');

                let newArticle = new NewsEntry({ title, description, author, imageUrl, content, tags, createdOn });

                newArticle.save((error, dbArticle) => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(dbArticle);
                });
            });
        },
        getNotDeletedNewsEntriesByPage(page, pageSize) {
            pageSize = +pageSize;
            return new Promise((resolve, reject) => {
                NewsEntry.find({})
                    .where({ isDeleted: false })
                    .sort({ createdOn: -1 })
                    .skip((page - 1) * pageSize)
                    .limit(pageSize)
                    .exec((error, newsEntries) => {
                        if (error) {
                            return reject(error);
                        }

                        NewsEntry.count((error, count) => {
                            if (error) {
                                return reject(error);
                            }

                            let pagesCount = pageCalculator.getPagesCount(count, pageSize);
                            let news = {
                                newsEntries,
                                pagesCount
                            };

                            return resolve(news);
                        });
                    });
            });
        },
        getNewsEntryById(id) {
            return new Promise((resolve, reject) => {
                NewsEntry.findOne({ _id: id }, (error, newsEntry) => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(newsEntry);
                });
            });
        },
        getNewsByTags(tags, currentArticle, articlesCount) {
            return new Promise((resolve, reject) => {
                NewsEntry.find({ tags: { '$in': tags } })
                    .where({ _id: { $ne: currentArticle._id } })
                    .where({ isDeleted: false })
                    .sort({ createdOn: -1 })
                    .limit(articlesCount)
                    .exec((error, newsEntries) => {
                        if (error) {
                            return reject(error);
                        }

                        return resolve(newsEntries);
                    });
            });
        },
        getLatestAsideNewsEntries(articlesCount, currentArticleId) {
            return new Promise((resolve, reject) => {
                NewsEntry.find({})
                    .where({ isDeleted: false })
                    .where({ _id: { $ne: currentArticleId } })
                    .sort({ createdOn: -1 })
                    .limit(articlesCount)
                    .exec((error, newsEntries) => {
                        if (error) {
                            return reject(error);
                        }
                        return resolve(newsEntries);
                    });
            });
        },
        editNewsEntry(id, title, description, imageUrl, content, tags) {
            tags = tags.split(',')
                .map(t => t.trim())
                .filter(t => t !== '');

            return new Promise((resolve, reject) => {
                NewsEntry.findOne({ _id: id }, (error, entry) => {
                    if (error) {
                        return reject(error);
                    }

                    entry.title = title;
                    entry.description = description;
                    entry.imageUrl = imageUrl;
                    entry.content = content;
                    entry.tags = tags;

                    entry.save((error, result) => {
                        if (error) {
                            return reject(error);
                        }

                        return resolve(result);
                    });
                });
            });
        },
        flagNewsEntryAsDeleted(id) {
            return new Promise((resolve, reject) => {
                NewsEntry.update({ _id: id }, { $set: { isDeleted: true } }, (error, result) => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(result);
                });
            });
        },
        commentNewsEntry(newsEntryId, userId, commentContent) {
            return new Promise((resolve, reject) => {
                NewsEntry.findOne({ _id: newsEntryId }, (error, newsEntry) => {
                    if (error) {
                        return reject(error);
                    } else if (!newsEntry) {
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
                        newsEntry.comments.push(comment);
                        newsEntry.save((error, result) => {
                            if (error) {
                                return reject(error);
                            }

                            return resolve(result);
                        });
                    });
                });
            });
        },
        deleteNewsEntryComment(newsEntryId, commentId) {
            return new Promise((resolve, reject) => {
                NewsEntry.findOne({ _id: newsEntryId }, (error, newsEntry) => {
                    if (error) {
                        return reject(error);
                    } else if (!newsEntry) {
                        return reject({ message: 'No such article found!' });
                    }

                    let comment = newsEntry.comments.find(x => x._id == commentId);
                    let index = newsEntry.comments.indexOf(comment);

                    if (index < 0) {
                        return reject({ message: 'No such comment found!' });
                    }

                    newsEntry.comments.splice(index, 1);
                    newsEntry.save((error, result) => {
                        if (error) {
                            return reject(error);
                        }

                        return resolve(result);
                    });
                });
            });
        },
        getAllNews(page, query, sort) {
            let pageSize = 10;

            let sortMethod = sort == 'status' ? { isDeleted: -1, createdOn: -1 } : { createdOn: -1 };
            let queryObj = query.trim() ? { title: { '$regex': query.trim(), '$options': 'i' } } : {};

            return new Promise((resolve, reject) => {
                NewsEntry.find(queryObj)
                    .sort(sortMethod)
                    .skip((page - 1) * pageSize)
                    .limit(pageSize)
                    .exec((error, newsEntries) => {
                        if (error) {
                            return reject(error);
                        }

                        NewsEntry.count(queryObj, (error, count) => {
                            if (error) {
                                return reject(error);
                            }

                            let pagesCount = pageCalculator.getPagesCount(count, pageSize);
                            let news = {
                                newsEntries,
                                pagesCount
                            };

                            return resolve(news);
                        });
                    });
            });
        },
        deleteNewsEntry(newsEntryId) {
            return new Promise((resolve, reject) => {
                NewsEntry.findOneAndRemove({ _id: newsEntryId }, (error, result) => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(result);
                });
            });
        },
        flagNewsEntryAsActive(newsEntryId) {
            return new Promise((resolve, reject) => {
                NewsEntry.update({ _id: newsEntryId }, { $set: { isDeleted: false } }, (error, result) => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(result);
                });
            });
        }
    };
};