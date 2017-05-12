import { compile } from 'templates-compiler';
import $ from 'jquery';
import * as statsService from 'stats-service';
import * as searchService from 'search-service';
import { getNotDeletedArticlesByPage as getLatestNews } from 'news-service';
import { getNotDeletedArticlesByPage as getLatestArticles } from 'articles-service';
import * as toastr from 'toastr';
import * as utils from 'utils';

const $mainContainer = $('#main-container');

function getHomePage() {
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
        .then(html => $mainContainer.html(html))
        .then(() => {
            _bindSearchAssets();
            utils.bindHomePageEvents();
        })
        .catch(() => {
            toastr.error('An error occured! Redirecting to another section...');
            $(location).attr('href', '#!/news');
        });
}

function getSearchPage(params, query) {
    let data = utils.searchQueryExtractor(query);

    Promise.all([
        searchService.searchThreads(data.page, data.query),
        searchService.searchArticles(data.page, data.query),
        searchService.searchNews(data.page, data.query)
    ])
        .then(([threads, articles, news]) => {
            threads.threads.forEach(thread => {
                thread.type = 'Forum';
                thread.link = 'forum';
                thread.createdOn = thread.lastPostCreatedOn;
            });
            articles.articles.forEach(article => {
                article.type = 'Article';
                article.link = 'articles';
            });
            news.newsEntries.forEach(entry => {
                entry.type = 'News';
                entry.link = 'news';
            });

            data.entries = [].concat(threads.threads).concat(articles.articles).concat(news.newsEntries);
            data.entries.sort((a, b) => {
                if (a.createdOn > b.createdOn) return -1;
                else if (a.createdOn < b.createdOn) return 1;
                else return 0;
            });

            data.pagination = {
                page: data.page,
                pageCount: Math.max(articles.pagesCount, news.pagesCount, threads.pagesCount)
            };

            return compile('search', data);
        })
        .then(html => $mainContainer.html(html))
        .then(() => {
            $('html, body').animate({
                scrollTop: $('body').offset().top
            }, 500);
            
            _bindSearchAssets(data);
        });
}

function _bindSearchAssets(data) {
    if (data && data.query != '!-!') {
        $('#input-search-home-page').val(data.query);
    }

    $('#input-search-home-page').on('change', () => {
        $(location).attr('href', `#!/search?query=${$('#input-search-home-page').val().trim()}`);
    });

    $('#btn-search-home-page').on('click', () => $('#input-search-home-page').trigger('change'));
}

export { getHomePage, getSearchPage };
