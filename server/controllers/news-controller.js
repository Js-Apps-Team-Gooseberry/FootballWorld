/* globals module */

module.exports = (data) => {
    return {
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
        }
    };
};