import * as requester from 'requester';

function getAllNotDeletedThreadsByCategory(category, page) {
    return requester.getJSON(`/api/forum/get-all-for-users/${category}/${page}`);
}

function createThread(title, content, imageUrl, category, tags) {
    let body = {
        title,
        content,
        imageUrl,
        category,
        tags
    };

    return requester.postJSON('/api/forum/create', body);
}

function getById(id) {
    return requester.getJSON(`/api/forum/get-by-id/${id}`);
}

function createNewPost(id, content) {
    let body = {
        content
    };

    return requester.postJSON(`/api/forum/create-post/${id}`, body);
}

function editThread(id, title, content, imageUrl, category, tags) {
    let body = {
        title,
        content,
        imageUrl,
        category,
        tags
    };

    return requester.putJSON(`/api/forum/edit-thread/${id}`, body);
}

function flagThreadAsDeleted(id) {
    return requester.putJSON(`/api/forum/flag-delete/${id}`);
}

function editPost(threadId, postId) {
    return requester.putJSON(`/api/forum/edit-post/${threadId}/${postId}`);
}

function deletePost(threadId, postId) {
    return requester.deleteJSON(`/api/forum/delete-post/${threadId}/${postId}`);
}

function toggleLikeThread(threadId) {
    return requester.putJSON(`/api/forum/like-thread/${threadId}`);
}

function toggleDislikeThread(threadId) {
    return requester.putJSON(`/api/forum/dislike-thread/${threadId}`);
}

function toggleLikePost(threadId, postId) {
    return requester.putJSON(`/api/forum/like-post/${threadId}/${postId}`);
}

function toggleDisikePost(threadId, postId) {
    return requester.putJSON(`/api/forum/dislike-post/${threadId}/${postId}`);
}

export {
    getAllNotDeletedThreadsByCategory,
    createThread,
    getById,
    createNewPost,
    editThread,
    flagThreadAsDeleted,
    editPost,
    deletePost,
    toggleLikePost,
    toggleDisikePost,
    toggleLikeThread,
    toggleDislikeThread
};