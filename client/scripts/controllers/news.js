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

            if (localStorage.getItem('currentUser')) {
                let currentUser = JSON.parse(localStorage.getItem('currentUser'));
                data.user = currentUser;
            }

            return compile('news-details', data);
        })
        .then(html => $mainContainer.html(html))
        .then(() => {
            const $newCommentTextArea = $('#news-new-comment-content'),
                $formNewsNewComment = $('#form-news-new-comment'),
                $btnNewsComment = $('#btn-news-comment'),
                $newsCommentBox = $('#news-comment-box');

            _bindDeleteButtons(data);

            $newCommentTextArea.on('focus', () => {
                $btnNewsComment.removeClass('hidden');
            });

            $btnNewsComment.on('click', () => {
                if ($newCommentTextArea.val().length < 3 || $newCommentTextArea.val().length > 500) {
                    toastr.error('The comments\' length must be between 3 and 300 symbols!');
                    $formNewsNewComment.addClass('has-error');
                    $newCommentTextArea.focus();
                    return;
                } else {
                    $formNewsNewComment.removeClass('has-error');
                }

                $btnNewsComment.addClass('disabled');
                $newCommentTextArea.attr('disabled', true);
                $btnNewsComment.attr('disabled', true);

                newsService.comment(data.article._id, data.user._id, $newCommentTextArea.val())
                    .then((response) => {

                        let newCommentData = response.comments[response.comments.length - 1];
                        newCommentData.author = data.user;

                        compile('comment', newCommentData)
                            .then(html => {
                                toastr.success('Comment submitted!');

                                $newsCommentBox.append(html);

                                $btnNewsComment.removeClass('disabled');
                                $newCommentTextArea.val('');
                                $newCommentTextArea.attr('disabled', false);
                                $btnNewsComment.attr('disabled', false);
                            });
                    })
                    .catch(error => {
                        console.log(error);
                        toastr.error('An error occured!');

                        $btnNewsComment.removeClass('disabled');
                        $newCommentTextArea.attr('disabled', false);
                        $btnNewsComment.attr('disabled', false);
                    });
            });
        })
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

function getEditPage(params) {
    if (!params || !params.id) {
        // handle the 404
    }

    newsService.getById(params.id)
        .then(data => {
            data.tags = data.tags.join(', ');
            return compile('news-edit', data);
        })
        .then(html => $mainContainer.html(html))
        .then(() => {
            const $btnNewsEdit = $('#btn-news-edit'),
                $newsEditTitle = $('#news-edit-title'),
                $newsEditImageUrl = $('#news-edit-image-url'),
                $newsEditTags = $('#news-edit-tags'),
                $newsEditContent = $('#news-edit-content'),
                $formNewsEditTitle = $('#form-news-edit-title'),
                $formNewsEditImageUrl = $('#form-news-edit-image-url'),
                $formNewsEditContent = $('#form-news-edit-content');

            $btnNewsEdit.on('click', () => {
                if ($newsEditTitle.val().trim().length < 5 || $newsEditTitle.val().trim().length > 100) {
                    toastr.error('Title length should be between 5 and 100 symbols!');
                    $formNewsEditTitle.addClass('has-error');
                    $newsEditTitle.focus();
                    return;
                } else {
                    $formNewsEditTitle.removeClass('has-error');
                }

                if (!_isUrlValid($newsEditImageUrl.val())) {
                    toastr.error('Please enter a valid URL!');
                    $formNewsEditImageUrl.addClass('has-error');
                    $newsEditImageUrl.focus();
                    return;
                } else {
                    $formNewsEditImageUrl.removeClass('has-error');
                }

                if ($newsEditContent.val().trim().length < 5 || $newsEditContent.val().trim().length > 5000) {
                    toastr.error('Content length should be between 5 and 5000 symbols!');
                    $formNewsEditContent.addClass('has-error');
                    $newsEditContent.focus();
                    return;
                } else {
                    $formNewsEditContent.removeClass('has-error');
                }

                $btnNewsEdit.attr('disabled', true);
                $btnNewsEdit.addClass('disabled');

                let title = $newsEditTitle.val();
                let imageUrl = $newsEditImageUrl.val();
                let tags = $newsEditTags.val();
                let content = $newsEditContent.val();

                newsService.editNewsEntry(params.id, title, imageUrl, content, tags)
                    .then(() => {
                        toastr.success('Article successfully altered!');
                        $(location).attr('href', `#/news/details/${params.id}`);
                    })
                    .catch(error => {
                        $btnNewsEdit.attr('disabled', false);
                        $btnNewsEdit.removeClass('disabled');
                        toastr.error('Invalid data! Try again!');
                        console.log(error);
                    });
            });
        });
}

function flagNewsEntryAsDeleted(params) {
    if (!params || !params.id) {
        // 404?
    }

    let $btnNewsDelete = $('btn-news-delete');
    $btnNewsDelete.addClass('disabled');
    $btnNewsDelete.attr('disabled', true);

    let id = params.id;

    newsService.flagNewsEntryAsDeleted(id)
        .then(response => {
            console.log(response);
            toastr.success('Article successfully flagged as deleted!');
            $(location).attr('href', '#/news');
        })
        .catch(error => {
            console.log(error);
            $btnNewsDelete.removeClass('disabled');
            $btnNewsDelete.attr('disabled', false);
            toastr.error('An error occured! Try again later!');
        });
}

function _bindDeleteButtons(data) {
    const $newsCommentBox = $('#news-comment-box');

    $newsCommentBox.on('click', '.btn-news-delete-comment', (ev) => {
        let commentId = $(ev.target).parent().parent().attr('id');
        newsService.deleteComment(data.article._id, commentId)
            .then(() => {
                toastr.success('Comment successfully deleted!');
                $(`#${commentId}`).remove();
            })
            .catch(error => {
                console.log(error);
                toastr.error('An error occurred!');
            });
    });
}

function _isUrlValid(str) {
    let pattern = new RegExp('^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$', 'i');
    return pattern.test(str);
}
export { getAll, getById, getCreatePage, getEditPage, flagNewsEntryAsDeleted };
