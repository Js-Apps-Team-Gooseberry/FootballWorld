import {compile} from 'templates-compiler';
import $ from 'jquery';
import * as articlesService from 'articles-service';
import * as toastr from 'toastr';

const $mainContainer = $('#main-container');

function getAllArticles(params) {
    let page;
    if (!params || !params.page) {
        page = 1;
    } else {
        page = params.page;
    }

    let pageSize = 6;

    articlesService.getNotDeletedArticlesByPage(page, pageSize)
        .then(data => {
            data.pagination = {
                pageCount: data.pagesCount,
                page
            };
            return compile('articles-list', data);
        })
        .then(html => $mainContainer.html(html));
}

function getArticleById(params) {
    if (!params || !params.id) {
        // handle the 404
    }

    let id = params.id;

    articlesService.getArticleById(id)
        .then(articles => {
            console.log(articles);
            return compile('articles-details',articles);
        })
        .then(html => $mainContainer.html(html))
}

function getCreateArticlePage() {
    compile('articles-create')
        .then(html => $mainContainer.html(html))
        .then(() => {
            const $btnArticleCreate = $('#btn-article-create'),
                $articleCreateTitle = $('#article-create-title'),
                $articleCreateUrl = $('#article-create-image-url'),
                $articleCreatePrediction = $('#article-create-prediction'),
                $articleCreateSideA = $('#article-create-sideA'),
                $articleCreateSideB = $('#article-create-sideB'),
                $articleCreateInjuredA = $('#article-create-injuredA'),
                $articleCreateInjuredB = $('#article-create-injuredB'),
                $articleCreateLineupsA = $('#article-create-lineupsA'),
                $articleCreateLineupsB = $('#article-create-lineupsB'),
                $articleCreateContent = $('#article-create-content'),

                $formArticleCreateTitle = $('#form-article-create-title'),
                $formArticleCreateUrl = $('#form-article-create-image-url'),
                $formArticleCreatePrediction = $('#form-article-create-prediction'),
                $formArticleCreateSideA = $('#form-article-create-sideA'),
                $formArticleCreateSideB = $('#form-article-create-sideB'),
                $formArticleCreateInjuredA = $('#form-article-create-injuredA'),
                $formArticleCreateInjuredB = $('#form-article-create-injuredB'),
                $formArticleCreateLineupsA = $('#form-article-create-lineupsA'),
                $formArticleCreateLineupsB = $('#form-article-create-lineupsB'),
                $formArticleCreateContent = $('#form-article-create-content');

            $btnArticleCreate.on('click', () => {
                validateStringLenght($articleCreateTitle, $formArticleCreateTitle, 5, 100, 'Title');
                validateImgUrl($articleCreateUrl, $formArticleCreateUrl);
                validateStringLenght($articleCreatePrediction, $formArticleCreatePrediction, 5, 50, 'Match prediction');
                validateStringLenght($articleCreateSideA, $formArticleCreateSideA, 3, 20, 'Home team');
                validateStringLenght($articleCreateSideB, $formArticleCreateSideB, 3, 20, 'Away team');
                validateStringLenght($articleCreateLineupsA, $formArticleCreateLineupsA, 10, 300, 'Team lineups');
                validateStringLenght($articleCreateLineupsB, $formArticleCreateLineupsB, 10, 300, 'Team lineups');
                validateStringLenght($articleCreateInjuredA, $formArticleCreateInjuredA, 10, 200, 'Injured players');
                validateStringLenght($articleCreateInjuredB, $formArticleCreateInjuredB, 10, 200, 'Injured players');
                validateStringLenght($articleCreateContent, $formArticleCreateContent, 10, 6000, 'Content');

                $btnArticleCreate.attr('disabled', true);
                $btnArticleCreate.addClass('disabled');


                let title = $articleCreateTitle.val(),
                    imageUrl = $articleCreateUrl.val(),
                    matchPrediction = $articleCreatePrediction.val(),
                    sideA = $articleCreateSideA.val(),
                    sideB = $articleCreateSideB.val(),
                    lineupsA = $articleCreateLineupsA.val(),
                    lineupsB = $articleCreateLineupsB.val(),
                    injuredA = $articleCreateInjuredA.val(),
                    injuredB = $articleCreateInjuredB.val(),
                    content = $articleCreateContent.val();


                articlesService.createNewArticle(title, imageUrl, matchPrediction, sideA, sideB, lineupsA, lineupsB, injuredA, injuredB, content)
                    .then(response => {
                        console.log(response);
                        toastr.success('Article successfully added!');
                        $(location).attr('href', '#/articles');
                    })
                    .catch(error => {
                        $btnArticleCreate.attr('disabled', false);
                        $btnArticleCreate.removeClass('disabled');
                        toastr.error('Invalid data! Try again!');
                        console.log(error);
                    });
            })
        });


    function validateStringLenght(element, formElement, below, above, string) {
        if (element.val().trim().length < below || formElement.val().trim().length > above) {
            toastr.error(`${string} length should be between ${below} and ${above} symbols!`);
            formElement.addClass('error');
            element.focus();
            return validateStringLenght();
        } else {
            formElement.removeClass('error');
        }
    }

    function validateImgUrl(element, formElement) {
        if (!_isUrlValid(element.val())) {
            toastr.error('Please enter a valid URL!');
            formElement.addClass('error');
            element.focus();
            return validateImgUrl();
        } else {
            formElement.removeClass('error');
        }
    }

    function _isUrlValid(str) {
        let pattern = new RegExp('^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$', 'i');
        return pattern.test(str);
    }
}

export {getCreateArticlePage, getAllArticles, getArticleById};