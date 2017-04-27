import * as requester from 'requester';

function getNotDeletedArticlesByPage(page) {
    let headers = {
        page
    };

    return requester.getJSON('/api/news/get-all-for-users', headers);
}

export { getNotDeletedArticlesByPage };