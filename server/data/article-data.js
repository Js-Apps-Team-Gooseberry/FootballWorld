/* globals module require */

const pageCalculator = require('../utils/page-calculator');

module.exports = (models) => {
    const Article = models.Article;

    return {
        createNewArticle(title, imageUrl, content, matchPrediction, sideA, sideB, lineupsA, lineupsB, injuredA, injuredB, createdOn) {
            return new Promise((resolve, reject) => {
                if (createdOn == null) {
                    createdOn = new Date();
                }

                let tags = [sideA, sideB];                

                let newArticle = new Article({ title, imageUrl, content, tags, matchPrediction, sideA, sideB, lineupsA, lineupsB, injuredA, injuredB, createdOn });

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
        }
    };
};