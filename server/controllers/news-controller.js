/* globals module */

module.exports = (data) => {
    return {
        createNewNewsEntry(req, res) {
            let title = req.body.title;
            let imageUrl = req.body.imageUrl;
            let content = req.body.content;
            let tags = req.body.tags;
            let createdOn = req.body.createdOn;

            data.createNewNewsEntry(title, imageUrl, content, tags, createdOn)
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
            let id = req.body.newsEntryId;

            data.getNewsEntryById(id)
                .then(newsEntry => {
                    if (!newsEntry) {
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
            let id = req.body.articleId;
            let title = req.body.title;
            let imageUrl = req.body.imageUrl;
            let content = req.body.content;
            let tags = req.body.tags;

            data.editNewsEntry(id, title, imageUrl, content, tags)
                .then((response) => {
                    return res.status(200).json(response);
                })
                .catch(error => {
                    return res.status(500).json(error);
                });
        }
    };
};