/* globals module */

module.exports = (data) => {
    return {
        createNewNewsEntry(req, res) {
            let title = req.body.title;
            let description = req.body.description;
            let author = req.body.author;
            let imageUrl = req.body.imageUrl;
            let content = req.body.content;
            let tags = req.body.tags;
            let createdOn = req.body.createdOn;

            data.createNewNewsEntry(title, description, author, imageUrl, content, tags, createdOn)
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
                    if (!newsEntry || newsEntry.isDeleted) {
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
            let description = req.body.description;
            let imageUrl = req.body.imageUrl;
            let content = req.body.content;
            let tags = req.body.tags;

            data.editNewsEntry(id, title, description, imageUrl, content, tags)
                .then((response) => {
                    return res.status(200).json(response);
                })
                .catch(error => {
                    return res.status(500).json(error);
                });
        },
        flagNewsEntryAsDeleted(req, res) {
            let id = req.body.articleId;

            data.flagNewsEntryAsDeleted(id)
                .then(response => {
                    return res.status(200).json(response);
                })
                .catch(error => {
                    return res.status(500).json(error);
                });
        },
        commentNewsEntry(req, res) {
            let newsEntryId = req.body.newsEntryId;
            let userId = req.body.userId;
            let content = req.body.commentContent;

            data.commentNewsEntry(newsEntryId, userId, content)
                .then(response => {
                    return res.status(201).json(response);
                })
                .catch(error => {
                    return res.status(500).json(error);
                });
        },
        deleteNewsEntryComment(req, res) {
            let newsEntryId = req.body.newsEntryId;
            let commentId = req.body.commentId;

            data.deleteNewsEntryComment(newsEntryId, commentId)
                .then(response => {
                    return res.status(200).json(response);
                })
                .catch(error => {
                    return res.status(500).json(error);
                });
        }
    };
};