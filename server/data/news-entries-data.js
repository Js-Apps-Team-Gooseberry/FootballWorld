/* globals module */

module.exports = (models) => {
    const NewsEntry = models.NewsEntry;

    return {
        createNewArticle(title, imageUrl, content, tagsStr, createdOn) {
            return new Promise((resolve, reject) => {
                if (createdOn == null) {
                    createdOn = new Date();
                }

                let tags = tagsStr.split(' ');

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

                            let news = {
                                newsEntries,
                                count
                            };

                            return resolve(news);
                        });
                    });
            });
        }
    };
};