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

export { getAllNews, deltePermanentlyNewsEntry, createNewCategory };
