import * as requester from 'requester';

function getAllNews(page, query, sort) {
    return requester.getJSON(`/api/news/get-all-admin/${page}/${query}/${sort}`);
}

function deltePermanentlyNewsEntry(newsEntryId) {
    return requester.deleteJSON(`/api/news/delete-entry/${newsEntryId}`);
}

export { getAllNews, deltePermanentlyNewsEntry };
