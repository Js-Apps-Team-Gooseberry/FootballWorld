import * as requester from 'requester';

function getNotDeletedArticlesByPage(page) {
    return requester.postJSON('/api/news/get-all-for-users', page);
}

export { getNotDeletedArticlesByPage };