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

function createNewEntry(title, description, imageUrl, content, tags) {
    let body = {
        title,
        description,
        imageUrl,
        content,
        tags
    };

    return requester.postJSON('/api/news/create', body);
}

function editNewsEntry(articleId, title, description, imageUrl, content, tags) {
    let body = {
        articleId,
        title,
        description,
        imageUrl,
        content,
        tags
    };

    return requester.putJSON('/api/news/edit', body);
}

function flagNewsEntryAsDeleted(articleId) {
    let body = {
        articleId
    };

    return requester.putJSON('/api/news/flag-delete', body);
}

function comment(newsEntryId, userId, commentContent) {
    let body = {
        newsEntryId,
        userId,
        commentContent
    };

    return requester.postJSON('/api/news/comment', body);
}

function deleteComment(newsEntryId, commentId) {
    let body = {
        newsEntryId,
        commentId
    };

    return requester.deleteJSON('/api/news/delete-comment', body);
}

export {
    getNotDeletedArticlesByPage,
    getById,
    getByTags,
    getAsideLatest,
    createNewEntry,
    editNewsEntry,
    flagNewsEntryAsDeleted,
    comment,
    deleteComment
};