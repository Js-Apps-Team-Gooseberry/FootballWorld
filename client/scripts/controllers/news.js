import { compile } from 'templates-compiler';
import $ from 'jquery';
import * as newsService from 'news-service';

const $mainContainer = $('#main-container');

function getAll(params) {    
    let page;
    if (!params || !params.page) {
        page = 1;
    } else {
        page = params.page;
    }

    newsService.getNotDeletedArticlesByPage(page)
        .then(data => {
            data.pagination = {
                pageCount: data.pagesCount,
                page
            };
            return compile('news-list', data);
        })
        .then(html => $mainContainer.html(html));
}

export { getAll };
