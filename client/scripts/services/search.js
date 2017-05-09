import * as requester from 'requester';

function searchThreads(page, query) {
    return requester.getJSON(`/api/forum/search/${page}/${query}`);
}

function searchArticles(page, query) {
    return requester.getJSON(`/api/articles/search/${page}/${query}`);
}

function searchNews(page, query) {
    return requester.getJSON(`/api/news/search/${page}/${query}`);
}

export { searchThreads, searchArticles, searchNews };