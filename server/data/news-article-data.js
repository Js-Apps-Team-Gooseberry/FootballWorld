/* globals module */

module.exports = (models) => {
    const NewsArticle = models.NewsArticle;
    // const Comment = models.Comment;

    return {
        createNewArticle(title, imageUrl, content, tagsStr, createdOn) {
            return new Promise((resolve, reject) => {
                if (createdOn == null) {
                    createdOn = new Date();
                }

                let tags = tagsStr.split(' ');

                let newArticle = new NewsArticle({ title, imageUrl, content, tags, createdOn });

                newArticle.save((error, dbArticle) => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(dbArticle);
                });
            });
        }
    };
};