/* globals module */

module.exports = (models) => {
    const Thread = models.Thread;

    return {
        createNewThread(title, content, imageUrl, category, tagsStr, authorId, authorUsername, authorAvatar) {
            return new Promise((resolve, reject) => {
                let createdOn = new Date();
                let lastPostCreatedOn = new Date();
                let tags = tagsStr.split(',').map(x => x.trim()).filter(x => x != '');
                let author = {
                    username: authorUsername,
                    userId: authorId,
                    userAvatar: authorAvatar
                };

                let thread = new Thread({ title, content, createdOn, lastPostCreatedOn, imageUrl, author, category, tags });
                thread.save((error, dbThread) => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(dbThread);
                });
            });
        },
        getNotDeletedThreadsByCategory(category, page) {
            const pageSize = 10;

            return new Promise((resolve, reject) => {
                Thread.find({ category: category })
                    .where({ isDeleted: false })
                    .sort({ lastPostCreatedOn: -1 })
                    .skip((page - 1) * pageSize)
                    .limit(pageSize)
                    .exec((error, threads) => {
                        if (error) {
                            return reject(error);
                        }

                        return resolve(threads);
                    });
            });
        },
        getThreadById(id) {
            return new Promise((resolve, reject) => {
                Thread.findOne({ _id: id }, (error, thread) => {
                    if (error) {
                        return reject(error);
                    }

                    thread.views += 1;
                    thread.save();
                    
                    return resolve(thread);
                });
            });
        }
    };
};