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

    let pageSize = 10;

    newsService.getNotDeletedArticlesByPage(page, pageSize)
        .then(data => {
            data.pagination = {
                pageCount: data.pagesCount,
                page
            };
            return compile('news-list', data);
        })
        .then(html => $mainContainer.html(html));
}

function getById(params) {
    if (!params || !params.id) {
        // handle the 404
    }

    let id = params.id;
    let data = {};
    let relatedCount = 5;
    let latestCount = 10;

    newsService.getById(id)
        .then(article => {
            data.article = article;
            return newsService.getByTags(article.tags, article, relatedCount);
        })
        .then(related => {
            data.related = related;
            return newsService.getAsideLatest(latestCount, data.article._id);
        })
        .then(latest => {            
            data.latest = latest;
            return compile('news-details', data);
        })
        .then(html => $mainContainer.html(html))
        .catch(error => {
            console.log(error);
        });
}

export { getAll, getById };
