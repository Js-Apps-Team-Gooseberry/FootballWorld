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
        articleId : id
    };

    return requester.postJSON('/api/articles/get-by-id', body)
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
    console.log(body);
    return requester.postJSON('/api/articles/create', body)
}

function commentArticle(commentId, userId, commentContent) {
    let body = {
        commentId,
        userId,
        commentContent
    };
    console.log(body);
    return requester.postJSON('/api/articles/comment')
}

export { createNewArticle, getNotDeletedArticlesByPage, getArticleById, commentArticle}