import { compile } from 'templates-compiler';
import $ from 'jquery';
import * as newsService from 'news-service';
import * as toastr from 'toastr';
import * as utils from 'utils';
import { NewsEntry } from 'news-entry-model';
import { Comment } from 'comment-model';

const $mainContainer = $('#main-container');

function getAll(params) {
    let page = !params ? 1 : params.page;
    let pageSize = 10;

    newsService.getNotDeletedArticlesByPage(page, pageSize)
        .then(data => {
            return compile('news/news-list', data);
        })
        .then(html => utils.changeMainContainerHtml(html))
        .catch(error => utils.loadErrorPage(error))
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
            data.user = JSON.parse(localStorage.getItem('currentUser'));
            return compile('news/news-details', data);
        })
        .then(html => utils.changeMainContainerHtml(html))
        .catch(error => utils.loadErrorPage(error))
        .then(() => {
            $('html, body').animate({
                scrollTop: $('body').offset().top
            }, 500);

            $('#btn-comments-scroll').on('click', () => {
                $('html, body').animate({
                    scrollTop: $('#news-comment-box').offset().top
                }, 1000);
            });

            _bindFacebookShareButton();
            _bindDeleteButtons(data);
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

    $newCommentTextArea.on('focus', () => {
        $btnNewsComment.removeClass('hidden');
    });

    $btnNewsComment.on('click', () => {
        if (!utils.isLoggedIn()) {
            toastr.error('You need to be logged in to comment!');
            return;
        }

        let comment;
        try {
            comment = new Comment($newCommentTextArea.val());
        } catch (error) {
            toastr.error(error.message);
            $formNewsNewComment.addClass('has-error');
            $newCommentTextArea.focus();
            return;
        }

        $formNewsNewComment.removeClass('has-error');
        $newCommentTextArea.attr('disabled', true);
        $btnNewsComment.attr('disabled', true);

        newsService.comment(data.article._id, data.user._id, comment.content)
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
                        $newCommentTextArea.val('');
                        $newCommentTextArea.attr('disabled', false);
                        $btnNewsComment.attr('disabled', false);
                    });
            })
            .catch(error => {
                console.log(error);
                toastr.error('An error occured!');

                $newCommentTextArea.attr('disabled', false);
                $btnNewsComment.attr('disabled', false);
            });
    });
}

function getCreatePage() {
    if (!utils.isAdmin()) {
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
                let newsEntry;
                try {
                    newsEntry = new NewsEntry($newsCreateTitle.val(), $newsCreateImageUrl.val(), $newsCreateTags.val(), $newsCreateDescription.val(), $newsCreateContent.val());
                } catch (error) {
                    if (error.message.indexOf('Title') == 0) {
                        toastr.error(error.message);
                        $formNewsCreateTitle.addClass('has-error');
                        $newsCreateTitle.focus();
                        return;
                    } else {
                        $formNewsCreateTitle.removeClass('has-error');
                    }

                    if (error.message.indexOf('URL') > -1) {
                        toastr.error('Please enter a valid URL!');
                        $formNewsCreateImageUrl.addClass('has-error');
                        $newsCreateImageUrl.focus();
                        return;
                    } else {
                        $formNewsCreateImageUrl.removeClass('has-error');
                    }

                    if (error.message.indexOf('Description') > -1) {
                        toastr.error(error.message);
                        $formNewsCreateDescription.addClass('has-error');
                        $newsCreateDescription.focus();
                        return;
                    } else {
                        $formNewsCreateDescription.removeClass('has-error');
                    }

                    if (error.message.indexOf('Content') == 0) {
                        toastr.error('Content length should be between 5 and 5000 symbols!');
                        $formNewsCreateContent.addClass('has-error');
                        $newsCreateContent.focus();
                        return;
                    } else {
                        $formNewsCreateContent.removeClass('has-error');
                    }
                }

                $('.form-group').removeClass('has-error').addClass('has-success');
                $btnNewsCreate.attr('disabled', true);
                $btnNewsCreate.addClass('disabled');

                newsService.createNewEntry(newsEntry.title, newsEntry.description, newsEntry.imageUrl, newsEntry.content, newsEntry.tags)
                    .then(() => {
                        toastr.success('Article successfully added!');
                        $(location).attr('href', '#!/news');
                    })
                    .catch(() => {
                        $btnNewsCreate.attr('disabled', false);
                        $btnNewsCreate.removeClass('disabled');
                        toastr.error('Invalid data! Try again!');
                    });
            });
        });
}

function getEditPage(params) {
    if (!utils.isAdmin()) {
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
                let newsEntry;
                try {
                    newsEntry = new NewsEntry($newsEditTitle.val(), $newsEditImageUrl.val(), $newsEditTags.val(), $newsEditDescription.val(), $newsEditContent.val());
                } catch (error) {
                    if (error.message.indexOf('Title') == 0) {
                        toastr.error(error.message);
                        $formNewsEditTitle.addClass('has-error');
                        $newsEditTitle.focus();
                        return;
                    } else {
                        $formNewsEditTitle.removeClass('has-error');
                    }

                    if (error.message.indexOf('URL') > -1) {
                        toastr.error('Please enter a valid URL!');
                        $formNewsEditImageUrl.addClass('has-error');
                        $newsEditImageUrl.focus();
                        return;
                    } else {
                        $formNewsEditImageUrl.removeClass('has-error');
                    }

                    if (error.message.indexOf('Description') > -1) {
                        toastr.error(error.message);
                        $formNewsEditDescription.addClass('has-error');
                        $newsEditDescription.focus();
                        return;
                    } else {
                        $formNewsEditDescription.removeClass('has-error');
                    }

                    if (error.message.indexOf('Content') == 0) {
                        toastr.error('Content length should be between 5 and 5000 symbols!');
                        $formNewsEditContent.addClass('has-error');
                        $newsEditContent.focus();
                        return;
                    } else {
                        $formNewsEditContent.removeClass('has-error');
                    }
                }

                $btnNewsEdit.attr('disabled', true);
                $btnNewsEdit.addClass('disabled');
                $('.form-group').removeClass('has-error').addClass('has-success');

                newsService.editNewsEntry(params.id, newsEntry.title, newsEntry.description, newsEntry.imageUrl, newsEntry.content, newsEntry.tags)
                    .then(() => {
                        toastr.success('Article successfully altered!');
                        $(location).attr('href', `#!/news/details/${params.id}`);
                    })
                    .catch(() => {
                        $btnNewsEdit.attr('disabled', false);
                        $btnNewsEdit.removeClass('disabled');
                        toastr.error('An error occured! Check if your data is correct or try again later!');
                    });
            });

            let $btnRestore = $('#btn-restore-news-entry');
            $btnRestore.on('click', () => {
                $btnRestore.addClass('disabled');
                $btnRestore.attr('disabled', true);

                newsService.flagNewsEntryAsActive(params.id)
                    .then(() => {
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

    if (!utils.isAdmin()) {
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

export { getAll, getById, getCreatePage, getEditPage, flagNewsEntryAsDeleted };
