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

export { getAllNotDeletedThreadsByCategory, createThread };