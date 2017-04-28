/* globals module */

module.exports = (data) => {
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

            data.createNewArticle(title, imageUrl, content, matchPrediction, sideA, sideB, lineupsA, lineupsB, injuredA, injuredB, createdOn)
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

            data.getArticleById(id)
                .then(article => {
                    if (!article) {
                        return res.status(404).json({ message: 'Not found!' });
                    }

                    return res.status(200).json(article);
                })
                .catch(error => {
                    return res.status(500).json(error);
                });
        }
    };
};