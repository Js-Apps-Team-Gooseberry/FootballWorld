/* globals module require */

const pageCalculator = require('../utils/page-calculator');

module.exports = (models) => {
    const NewsEntry = models.NewsEntry;

    return {
        createNewNewsEntry(title, imageUrl, content, tagsStr, createdOn) {
            return new Promise((resolve, reject) => {
                if (createdOn == null) {
                    createdOn = new Date();
                }

                let tags = tagsStr.split(',').filter(t => t.trim() !== '');

                let newArticle = new NewsEntry({ title, imageUrl, content, tags, createdOn });

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
        editNewsEntry(id, title, imageUrl, content, tags) {
            tags = tags.split(',')
                .map(t => t.trim())
                .filter(t => t !== '');

            return new Promise((resolve, reject) => {
                NewsEntry.update({ _id: id }, { $set: { title: title, imageUrl: imageUrl, content: content, tags: tags } }, (error, result) => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(result);
                });
            });
        }
    };
};