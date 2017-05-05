import { compile } from 'templates-compiler';
import $ from 'jquery';
import * as newsService from 'news-service';
import * as toastr from 'toastr';
import { isAdmin, isLoggedIn } from 'utils';

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
            return compile('news/news-list', data);
        })
        .then(html => $mainContainer.html(html))
        .catch(error => {
            if (error.status == 500) {
                compile('errors/server-error')
                    .then(html => $mainContainer.html(html));
            } else if (error.status == 404) {
                compile('errors/not-found')
                    .then(html => $mainContainer.html(html));
            }
        })
        .then(() => {
            $('.pagination').on('click', 'a', () => {
                $('html, body').animate({
                    scrollTop: $('body').offset().top
                }, 500);
            });
        });
}

function getById(params) {
    let id = params.id;
    let data = {};
    let relatedCount = 6;
    let latestCount = 12;

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

            return compile('news/news-details', data);
        })
        .then(html => $mainContainer.html(html))
        .catch(error => {
            if (error.status == 500) {
                compile('errors/server-error')
                    .then(html => $mainContainer.html(html));
            } else if (error.status == 404) {
                compile('errors/not-found')
                    .then(html => $mainContainer.html(html));
            }
        })
        .then(() => {
            $('html, body').animate({
                scrollTop: $('body').offset().top
            }, 500);

            _bindFacebookShareButton();

            const $newCommentTextArea = $('#news-new-comment-content'),
                $btnNewsComment = $('#btn-news-comment');

            _bindDeleteButtons(data);

            $newCommentTextArea.on('focus', () => {
                $btnNewsComment.removeClass('hidden');
            });

            $('#btn-comments-scroll').on('click', () => {
                $('html, body').animate({
                    scrollTop: $('#news-comment-box').offset().top
                }, 1000);
            });

            _bindCommentButton(data);
        })
        .catch(error => {
            console.log(error);
        });
}

function _bindFacebookShareButton() {
    let $btnFacebookShare = $('#btn-facebook-share');
    $btnFacebookShare.click((ev) => {
        ev.preventDefault();
        window.open(
            $btnFacebookShare.attr('href'),
            'popupWindow',
            'width=600,height=600'
        );
    });
}

function _bindDeleteButtons(data) {
    const $newsCommentBox = $('#news-comment-box');

    $newsCommentBox.on('click', '.btn-news-delete-comment', (ev) => {
        if (ev.isDefaultPrevented()) {
            return;
        }

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

function _bindCommentButton(data) {
    const $newCommentTextArea = $('#news-new-comment-content'),
        $btnNewsComment = $('#btn-news-comment'),
        $formNewsNewComment = $('#form-news-new-comment'),
        $newsCommentBox = $('#news-comment-box');

    $btnNewsComment.on('click', () => {
        if (!isLoggedIn()) {
            toastr.error('You need to be logged in to comment!');
            return;
        }

        if ($newCommentTextArea.val().length < 3 || $newCommentTextArea.val().length > 500) {
            toastr.error('The comments\' length must be between 3 and 500 symbols!');
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

                        $('html, body').animate({
                            scrollTop: $(`#${newCommentData._id}`).offset().top - 55
                        }, 1000);

                        $btnNewsComment.addClass('hidden');
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
}

function getCreatePage() {
    if (!isAdmin()) {
        $(location).attr('href', '#!/home');
        toastr.error('Unauthorized!');
        return;
    }

    compile('news/news-create')
        .then(html => $mainContainer.html(html))
        .then(() => {
            const $btnNewsCreate = $('#btn-news-create'),
                $newsCreateTitle = $('#news-create-title'),
                $newsCreateImageUrl = $('#news-create-image-url'),
                $newsCreateTags = $('#news-create-tags'),
                $newsCreateDescription = $('#news-create-description'),
                $newsCreateContent = $('#news-create-content'),
                $formNewsCreateTitle = $('#form-news-create-title'),
                $formNewsCreateImageUrl = $('#form-news-create-image-url'),
                $formNewsCreateDescription = $('#form-news-create-description'),
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

                if ($newsCreateDescription.val().trim().length < 20 || $newsCreateDescription.val().trim().length > 1000) {
                    toastr.error('Description length should be between 20 and 1000 symbols!');
                    $formNewsCreateDescription.addClass('has-error');
                    $newsCreateDescription.focus();
                    return;
                } else {
                    $formNewsCreateDescription.removeClass('has-error');
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
                let description = $newsCreateDescription.val();
                let imageUrl = $newsCreateImageUrl.val();
                let tags = $newsCreateTags.val();
                let content = $newsCreateContent.val();

                newsService.createNewEntry(title, description, imageUrl, content, tags)
                    .then(response => {
                        console.log(response);
                        toastr.success('Article successfully added!');
                        $(location).attr('href', '#!/news');
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
    if (!isAdmin()) {
        $(location).attr('href', '#!/home');
        toastr.error('Unauthorized!');
        return;
    }

    newsService.getById(params.id)
        .then(data => {
            data.tags = data.tags.join(', ');
            return compile('news/news-edit', data);
        })
        .catch(error => {
            if (error.status == 500) {
                compile('errors/server-error')
                    .then(html => $mainContainer.html(html));
            } else if (error.status == 404) {

                compile('errors/not-found')
                    .then(html => $mainContainer.html(html));
            }
        })
        .then(html => $mainContainer.html(html))
        .then(() => {
            const $btnNewsEdit = $('#btn-news-edit'),
                $newsEditTitle = $('#news-edit-title'),
                $newsEditImageUrl = $('#news-edit-image-url'),
                $newsEditTags = $('#news-edit-tags'),
                $newsEditDescription = $('#news-edit-description'),
                $newsEditContent = $('#news-edit-content'),
                $formNewsEditTitle = $('#form-news-edit-title'),
                $formNewsEditImageUrl = $('#form-news-edit-image-url'),
                $formNewsEditDescription = $('#form-news-edit-description'),
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

                if ($newsEditDescription.val().trim().length < 20 || $newsEditDescription.val().trim().length > 1000) {
                    toastr.error('Description length should be between 20 and 1000 symbols!');
                    $formNewsEditDescription.addClass('has-error');
                    $newsEditDescription.focus();
                    return;
                } else {
                    $formNewsEditDescription.removeClass('has-error');
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
                let description = $newsEditDescription.val();
                let tags = $newsEditTags.val();
                let content = $newsEditContent.val();

                newsService.editNewsEntry(params.id, title, description, imageUrl, content, tags)
                    .then(() => {
                        toastr.success('Article successfully altered!');
                        $(location).attr('href', `#!/news/details/${params.id}`);
                    })
                    .catch(error => {
                        $btnNewsEdit.attr('disabled', false);
                        $btnNewsEdit.removeClass('disabled');
                        toastr.error('An error occured! Check if your data is correct or try again later!');
                        console.log(error);
                    });
            });

            let $btnRestore = $('#btn-restore-news-entry');
            $btnRestore.on('click', () => {
                $btnRestore.addClass('disabled');
                $btnRestore.attr('disabled', true);

                newsService.flagNewsEntryAsActive(params.id)
                    .then(response => {
                        console.log(response);
                        toastr.success('Article restored');
                    })
                    .catch(error => {
                        console.log(error);
                        toastr.error('An error occured!');

                        $btnRestore.removeClass('disabled');
                        $btnRestore.attr('disabled', false);
                    });
            });
        });
}

function flagNewsEntryAsDeleted(params) {
    let id = params.id;

    if (!isAdmin()) {
        $(location).attr('href', `#!/news/details/${params.id}`);
        toastr.error('Unauthorized!');
        return;
    }

    let $btnNewsDelete = $('btn-news-delete');
    $btnNewsDelete.addClass('disabled');
    $btnNewsDelete.attr('disabled', true);

    newsService.flagNewsEntryAsDeleted(id)
        .then(() => {
            toastr.success('Article successfully flagged as deleted!');
            $(location).attr('href', '#!/news');
        })
        .catch(error => {
            console.log(error);
            $btnNewsDelete.removeClass('disabled');
            $btnNewsDelete.attr('disabled', false);
            toastr.error('An error occured! Try again later!');
        });
}

function _isUrlValid(str) {
    let pattern = new RegExp('^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$', 'i');
    return pattern.test(str);
}
export { getAll, getById, getCreatePage, getEditPage, flagNewsEntryAsDeleted };
