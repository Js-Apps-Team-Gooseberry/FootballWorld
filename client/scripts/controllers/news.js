import { compile } from 'templates-compiler';
import $ from 'jquery';
import * as newsService from 'news-service';
import * as toastr from 'toastr';

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

function getCreatePage() {
    compile('news-create')
        .then(html => $mainContainer.html(html))
        .then(() => {
            const $btnNewsCreate = $('#btn-news-create'),
                $newsCreateTitle = $('#news-create-title'),
                $newsCreateImageUrl = $('#news-create-image-url'),
                $newsCreateTags = $('#news-create-tags'),
                $newsCreateContent = $('#news-create-content'),
                $formNewsCreateTitle = $('#form-news-create-title'),
                $formNewsCreateImageUrl = $('#form-news-create-image-url'),
                $formNewsCreateContent = $('#form-news-create-content');

            $btnNewsCreate.on('click', () => {
                if ($newsCreateTitle.val().trim().length < 5 || $newsCreateTitle.val().trim().length > 100) {
                    toastr.error('Title length should be between 5 and 100 symbols!');
                    $formNewsCreateTitle.addClass('has-error');
                    $newsCreateTitle.focus();
                    return;
                } else {
                    $formNewsCreateTitle.removeClass('has-error');
                }

                if (!_isUrlValid($newsCreateImageUrl.val())) {
                    toastr.error('Please enter a valid URL!');
                    $formNewsCreateImageUrl.addClass('has-error');
                    $newsCreateImageUrl.focus();
                    return;
                } else {
                    $formNewsCreateImageUrl.removeClass('has-error');
                }

                if ($newsCreateContent.val().trim().length < 5 || $newsCreateContent.val().trim().length > 5000) {
                    toastr.error('Content length should be between 5 and 5000 symbols!');
                    $formNewsCreateContent.addClass('has-error');
                    $newsCreateContent.focus();
                    return;
                } else {
                    $formNewsCreateContent.removeClass('has-error');
                }

                $btnNewsCreate.attr('disabled', true);
                $btnNewsCreate.addClass('disabled');

                let title = $newsCreateTitle.val();
                let imageUrl = $newsCreateImageUrl.val();
                let tags = $newsCreateTags.val();
                let content = $newsCreateContent.val();

                newsService.createNewEntry(title, imageUrl, content, tags)
                    .then(response => {
                        console.log(response);
                        toastr.success('Article successfully added!');
                        $(location).attr('href', '#/news');
                    })
                    .catch(error => {
                        $btnNewsCreate.attr('disabled', false);
                        $btnNewsCreate.removeClass('disabled');
                        toastr.error('Invalid data! Try again!');
                        console.log(error);
                    });
            });
        });
}

function _isUrlValid(str) {
    let pattern = new RegExp('^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$','i');
    return pattern.test(str);
}
export { getAll, getById, getCreatePage };
