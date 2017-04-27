import * as requester from 'requester';

function getNotDeletedArticlesByPage(page, pageSize) {
    let headers = {
        page,
        pageSize
    };

    return requester.getJSON('/api/news/get-all-for-users', headers);
}

function getById(id) {
    let body = {
        newsEntryId: id
    };

    return requester.postJSON('/api/news/get-by-id', body);
}

function getByTags(tags, currentArticle, articlesCount) {
    let body = {
        tags,
        currentArticle,
        articlesCount
    };

    return requester.postJSON('/api/news/get-by-tag', body);
}

function getAsideLatest(articlesCount, currentArticleId) {
    let body = {
        articlesCount,
        currentArticleId
    };

    return requester.postJSON('/api/news/get-aside-latest', body);
}

export { getNotDeletedArticlesByPage, getById, getByTags, getAsideLatest };