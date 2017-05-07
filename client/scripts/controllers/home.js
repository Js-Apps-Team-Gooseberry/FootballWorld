import { compile } from 'templates-compiler';
import $ from 'jquery';
import * as statsService from 'stats-service';
import { getNotDeletedArticlesByPage as getLatestNews } from 'news-service';
import { getNotDeletedArticlesByPage as getLatestArticles } from 'articles-service';

const $mainContainer = $('#main-container');

function get() {
    let page = 1;
    let pageSize = 3;

    Promise.all([statsService.getStandings(), getLatestNews(page, pageSize), getLatestArticles(page, pageSize)])
        .then(([standings, news, articles]) => {
            let data = {
                standings,
                news: news.newsEntries,
                articles: articles.articles
            };
            
            return compile('home', data);
        })
        .then(html => $mainContainer.html(html));
}

export { get };
