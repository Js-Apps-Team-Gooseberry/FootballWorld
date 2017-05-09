import * as requester from 'requester';

function getNotDeletedArticlesByPage(page, pageSize) {
    let body = {
        page,
        pageSize
    };

    return requester.postJSON('/api/articles/get-all-not-deleted-articles', body);
}

function getArticleById(id) {
    let body = {
        articleId: id
    };

    return requester.postJSON('/api/articles/get-by-id', body);
}


function createNewArticle(title, imageUrl, matchPrediction, sideA, sideB, lineupsA, lineupsB, injuredA, injuredB, content) {
    let body = {
        title,
        imageUrl,
        matchPrediction,
        sideA,
        sideB,
        lineupsA,
        lineupsB,
        injuredA,
        injuredB,
        content
    };

    return requester.postJSON('/api/articles/create', body);
}

function editArticle(id, title, imageUrl, content, matchPrediction, sideA, sideB, lineupsA, lineupsB, injuredA, injuredB) {
    let body = {
        title,
        imageUrl,
        content,
        matchPrediction,
        sideA,
        sideB,
        lineupsA,
        lineupsB,
        injuredA,
        injuredB
    };

    return requester.putJSON(`/api/articles/edit-article/${id}`, body);
}

function commentArticle(articleId, userId, commentContent) {
    let body = {
        articleId,
        userId,
        commentContent
    };

    return requester.postJSON('/api/articles/comment', body);
}

function deleteComment(articleId, commentId) {
    let body = {
        articleId,
        commentId
    };

    return requester.deleteJSON('/api/articles/delete-comment', body);
}

function flagArticleAsDeleted(id) {

    return requester.putJSON(`/api/articles/flag-delete/${id}`);
}

export {
    createNewArticle,
    getNotDeletedArticlesByPage,
    getArticleById,
    commentArticle,
    deleteComment,
    flagArticleAsDeleted,
    editArticle
 };