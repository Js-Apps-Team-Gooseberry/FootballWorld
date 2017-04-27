/* globals module */

const pageSize = 10;

module.exports = (data) => {
    return {
        getNewsForUsers(req, res) {
            let page = req.body.page;
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
        }
    };
};