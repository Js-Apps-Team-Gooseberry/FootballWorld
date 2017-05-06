import * as requester from 'requester';

function getAllNews(page, query, sort) {
    return requester.getJSON(`/api/news/get-all-admin/${page}/${query}/${sort}`);
}

function deltePermanentlyNewsEntry(newsEntryId) {
    return requester.deleteJSON(`/api/news/delete-entry/${newsEntryId}`);
}

function createNewCategory(title, description, linkName, imageUrl) {
    let body = {
        title,
        description,
        imageUrl,
        linkName
    };

    return requester.postJSON('/api/forum/create-category', body);
}

function getAllThreads(page, query, sort) {
    return requester.getJSON(`/api/forum/get-all-admin/${page}/${query}/${sort}`);
}

function deleteThreadPermanently(id) {
    return requester.deleteJSON(`/api/forum/delete-thread/${id}`);
}

function getAllUsers(page, query, sort) {
    return requester.getJSON(`/api/auth/get-all/${page}/${query}/${sort}`);
}

function deleteUser(id) {
    return requester.deleteJSON(`/api/auth/delete-user/${id}`);
}

function getAllArticles(page, query, sort) {
    return requester.getJSON(`/api/articles/get-all-admin/${page}/${query}/${sort}`);
}

function deleteArticlePermanently(id) {
    return requester.deleteJSON(`/api/articles/delete-article/${id}`);
}

export {
    getAllNews,
    deltePermanentlyNewsEntry,
    createNewCategory,
    getAllThreads,
    deleteThreadPermanently,
    getAllUsers,
    deleteUser,
    deleteArticlePermanently,
    getAllArticles
};
