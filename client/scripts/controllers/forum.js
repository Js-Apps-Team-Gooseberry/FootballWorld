import { compile } from 'templates-compiler';
import * as forumService from 'forum-service';
import * as toastr from 'toastr';
import $ from 'jquery';
import { isLoggedIn, isAuthorized } from 'utils';
import { Thread } from 'thread-model';

const $mainContainer = $('#main-container');

function getMainPage() {
    forumService.getCategories()
        .then(categories => {
            return compile('forum/main', categories);
        })
        .then(html => $mainContainer.html(html));
}

function getCreatePage() {
    if (!isLoggedIn()) {
        toastr.error('You need to be logged in to create forum threads!');
        $(location).attr('href', '#!/forum');
        return;
    }

    compile('forum/create')
        .then(html => $mainContainer.html(html))
        .then(() => {
            const $btnCreateThread = $('#btn-thread-create');

            const $threadCreateTitle = $('#create-thread-title');
            const $threadCreateContent = $('#create-thread-content');
            const $threadCreateImageUrl = $('#create-thread-image-url');
            const $threadCreateTags = $('#create-thread-tags');
            const $threadCreateCategory = $('#create-thread-category');

            const $formThreadCreateTitle = $('#form-create-thread-title');
            const $formThreadCreateContent = $('#form-create-thread-content');
            const $formThreadCreateImageUrl = $('#form-create-thread-image-url');
            const $formThreadCreateTags = $('#form-create-thread-tags');

            $btnCreateThread.on('click', () => {
                let thread;
                try {
                    thread = new Thread($threadCreateTitle.val(), $threadCreateImageUrl.val(), $threadCreateTags.val(),
                        $threadCreateCategory.val(), $threadCreateContent.val());
                } catch (error) {
                    if (error.message.indexOf('Title') == 0) {
                        toastr.error(error.message);
                        $formThreadCreateTitle.addClass('has-error');
                        $threadCreateTitle.focus();
                        return;
                    } else {
                        $formThreadCreateTitle.removeClass('has-error');
                    }

                    if (error.message.indexOf('URL') > -1) {
                        toastr.error(error.message);
                        $formThreadCreateImageUrl.addClass('has-error');
                        !$threadCreateImageUrl.focus();
                        return;
                    } else {
                        $formThreadCreateImageUrl.removeClass('has-error');
                    }

                    if (error.message.indexOf('Tags') > -1) {
                        toastr.error(error.message);
                        $formThreadCreateTags.addClass('has-error');
                        !$threadCreateTags.focus();
                        return;
                    } else {
                        $formThreadCreateTags.removeClass('has-error');
                    }

                    if (error.message.indexOf('category') > -1) {
                        toastr.error(error.message);
                        return;
                    }

                    if (error.message.indexOf('Content') > -1) {
                        toastr.error('Thread content length must be between 5 and 2000 symbols!');
                        $formThreadCreateContent.addClass('has-error');
                        !$threadCreateContent.focus();
                        return;
                    } else {
                        $formThreadCreateContent.removeClass('has-error');
                    }
                }

                $('.form-group').removeClass('has-error').addClass('has-success');
                $btnCreateThread.attr('diasabled', true);

                forumService.createThread(thread.title, thread.content, thread.imageUrl, thread.category, thread.tags)
                    .then(() => {
                        toastr.success('Thread successfully created!');
                        $(location).attr('href', `#!/forum/${thread.category}`);
                    })
                    .catch(error => {
                        console.log(error);
                        toastr.error('An error occured! Check if your data is valid or try again later!');
                        $btnCreateThread.attr('diasabled', false);
                    });
            });
        })
        .catch(error => {
            console.log(error);
            toastr.error('An error occured!');
        });
}

function getCategoryPage(params) {
    let category = params.category;
    let page = params.page || 1;
    let user = localStorage.getItem('currentUser');

    forumService.getAllNotDeletedThreadsByCategory(category, page)
        .then(response => {
            let pagination = {
                pageCount: response.pagesCount,
                page
            };

            let data = {
                category: category,
                threads: response.threads,
                pagination,
                user
            };

            return compile('forum/category', data);
        })
        .then(html => $mainContainer.html(html))
        .catch(error => {
            if (error.status == 404) {
                compile('errors/not-found')
                    .then(html => {
                        $mainContainer.html(html);
                    });
            } else if (error.status == 500) {
                compile('errors/server-error')
                    .then(html => {
                        $mainContainer.html(html);
                    });
            }
        });
}

function getThread(params) {
    let id = params.id;
    let page = params.page || 1;
    let pageSize = 10;
    let data = {};
    let user = JSON.parse(localStorage.getItem('currentUser'));

    forumService.getById(id)
        .then(response => {
            let pagination = {
                pageCount: 1,
                page
            };

            if (response.posts) {
                pagination.pageCount = Math.ceil(response.posts.length / pageSize) || 1;
                response.posts = response.posts.slice((page - 1) * pageSize, ((page - 1) * pageSize) + pageSize);
            }

            data = {
                thread: response,
                pagination,
                user
            };
            
            return compile('forum/details', data);
        })
        .then(html => $mainContainer.html(html))
        .then(() => {
            _bindLikeThreadButton(id);
            _bindDislikeThreadButton(id);
            _bindLikePostButton(id);
            _bindDislikePostButton(id);
            _bindDeletePostButton(id);
            _bindEditPostButton(id);
            _bindCreateNewPostEvent(id, data.pagination.pageCount);
        })
        .catch(error => {
            if (error.status == 404) {
                compile('errors/not-found')
                    .then(html => $mainContainer.html(html));
                return;
            } else if (error.status == 500) {
                compile('errors/server-error')
                    .then(html => $mainContainer.html(html));
                return;
            }

            console.log(error);
            toastr.error('An error occured!');
            $(location).attr('href', '#!/forum');
        });
}

function _bindEditPostButton(threadId) {
    $('#posts-container').on('click', '.btn-edit-post', (ev) => {
        let postId = $(ev.target).parents('.forum-post').attr('id');

        $(`#${postId} .post-preview-state`).addClass('hidden');
        $(`#${postId} .post-edit-state`).removeClass('hidden');
    });

    $('#posts-container').on('click', '.btn-cancel-edit-post', (ev) => {
        let postId = $(ev.target).parents('.forum-post').attr('id');

        $(`#${postId} .post-edit-state`).addClass('hidden');
        $(`#${postId} .post-preview-state`).removeClass('hidden');
    });


    $('#posts-container').on('click', '.btn-submit-edit-post', (ev) => {
        let postId = $(ev.target).parents('.forum-post').attr('id');
        let $content = $(`#${postId} .edit-post-input`);
        let $formContent = $(`#${postId} .form-edit-post`);
        if (!$content.val().trim() || $content.val().trim().length < 5 || $content.val().trim().length > 1400) {
            toastr.error('Post content length should be between 5 and 1400 symbols!');
            $content.focus();
            $formContent.addClass('has-error');
            return;
        } else {
            $formContent.removeClass('has-error');
        }

        $content.attr('disabled', true);
        $('.btn-submit-edit-post').attr('disabled', true);

        forumService.editPost(threadId, postId, $content.val().trim())
            .then(post => {
                toastr.success('Post successfully edited!');
                $(`#${postId} .thread-post-content`).html(post.content);
                $(`#${postId} .post-edit-state`).addClass('hidden');
                $(`#${postId} .post-preview-state`).removeClass('hidden');
                $content.attr('disabled', false);
                $('.btn-submit-edit-post').attr('disabled', false);
            })
            .catch(error => {
                console.log(error);
                toastr.error('An error occured!');
                $content.attr('disabled', false);
                $('.btn-submit-edit-post').attr('disabled', false);
            });
    });
}

function _bindDeletePostButton(threadId) {
    $('#posts-container').on('click', '.btn-delete-post', (ev) => {
        if (ev.isDefaultPrevented()) {
            return;
        }

        let postId = $(ev.target).parents('.forum-post').attr('id');

        forumService.deletePost(threadId, postId)
            .then(() => {
                $(`#${postId}`).remove();
                toastr.success('Post removed!');
            })
            .catch(error => {
                console.log(error);
                toastr.error('An error occured!');
            });
    });
}

function _bindLikePostButton(threadId) {
    $('#posts-container').on('click', '.btn-like-post', (ev) => {
        let postId = $(ev.target).parents('.forum-post').attr('id');

        forumService.toggleLikePost(threadId, postId)
            .then(post => {
                $(`#${postId} .likes-count`).html(post.likes.length);
                $(`#${postId} .dislikes-count`).html(post.dislikes.length);
                toastr.success('Vote submitted!');
            })
            .catch(error => {
                if (error.status == 401) {
                    toastr.error('You need to sign in to do that!');
                    return;
                }

                console.log(error);
                toastr.error('An error occured!');
            });
    });
}

function _bindDislikePostButton(threadId) {
    $('#posts-container').on('click', '.btn-dislike-post', (ev) => {
        let postId = $(ev.target).parents('.forum-post').attr('id');

        forumService.toggleDislikePost(threadId, postId)
            .then(post => {
                $(`#${postId} .likes-count`).html(post.likes.length);
                $(`#${postId} .dislikes-count`).html(post.dislikes.length);
                toastr.success('Vote submitted!');
            })
            .catch(error => {
                if (error.status == 401) {
                    toastr.error('You need to sign in to do that!');
                    return;
                }

                console.log(error);
                toastr.error('An error occured!');
            });
    });
}

function _bindLikeThreadButton(threadId) {
    $('#btn-thread-like').on('click', () => {
        forumService.toggleLikeThread(threadId)
            .then(response => {
                $('#likes-count').html(response.likes.length);
                $('#dislikes-count').html(response.dislikes.length);
                toastr.success('Vote submitted!');
            })
            .catch(error => {
                if (error.status == 401) {
                    toastr.error('You need to sign in to do that!');
                    return;
                }

                console.log(error);
                toastr.error('An error occured!');
            });
    });
}

function _bindDislikeThreadButton(threadId) {
    $('#btn-thread-dislike').on('click', () => {
        forumService.toggleDislikeThread(threadId)
            .then(response => {
                $('#likes-count').html(response.likes.length);
                $('#dislikes-count').html(response.dislikes.length);
                toastr.success('Vote submitted!');
            })
            .catch(error => {
                if (error.status == 401) {
                    toastr.error('You need to sign in to do that!');
                    return;
                }

                console.log(error);
                toastr.error('An error occured!');
            });
    });
}

function _bindCreateNewPostEvent(threadId, pagesCount) {
    const $btnNewPost = $('#btn-new-post'),
        $newPostContent = $('#new-post-input'),
        $formNewPost = $('#form-new-post');

    $('#btn-reveal-new-post').on('click', () => {
        $('#new-post-reveal').addClass('hidden');
        $('#new-post-preview').removeClass('hidden');
        $('html, body').animate({
            scrollTop: $('#new-post-preview').offset().top - 55
        }, 1000);
    });

    $('#btn-hide-new-post').on('click', () => {
        $newPostContent.val('');
        $('#new-post-preview').addClass('hidden');
        $('#new-post-reveal').removeClass('hidden');
    });

    $btnNewPost.on('click', () => {
        if (!$newPostContent.val().trim() || $newPostContent.val().trim().length < 5 || $newPostContent.val().trim().length > 1400) {
            toastr.error('Post content length should be between 5 and 1400 symbols!');
            $newPostContent.focus();
            $formNewPost.addClass('has-error');
            return;
        } else {
            $formNewPost.removeClass('has-error');
        }

        $newPostContent.attr('disabled', true);
        $btnNewPost.attr('disabled', true);

        let content = $newPostContent.val().trim();
        let post;

        forumService.createNewPost(threadId, content)
            .then(result => {
                post = result.posts[result.posts.length - 1];
                return compile('forum/post', post);
            })
            .then(html => {
                $(location).attr('href', `#/forum/details/${threadId}/${pagesCount}`);
                $('#posts-container').append(html);
                $('html, body').animate({
                    scrollTop: $(`#${post._id}`).offset().top - 55
                }, 1000);

                toastr.success('Post successfully created!');
                $('#new-post-preview').addClass('hidden');
                $('#new-post-reveal').removeClass('hidden');
                $newPostContent.val('');
                $newPostContent.attr('disabled', false);
                $btnNewPost.attr('disabled', false);
            })
            .catch(error => {
                if (error.status == 401) {
                    toastr.error('You need to sign in to do that!');
                    return;
                }

                toastr.error('An error occured!');
                console.log(error);
                $newPostContent.attr('disabled', false);
                $btnNewPost.attr('disabled', false);
            });
    });
}

function getEditThreadPage(params) {
    let id = params.id;
    let data = {};

    forumService.getById(id)
        .then(thread => {
            thread.tags = thread.tags.join(', ');
            data = thread;

            if (!isAuthorized(thread.author.userId)) {
                toastr.error('You are not authorized to do that!');
                $(location).attr('href', '#!/forum');
                return;
            }

            return compile('forum/edit-thread', thread);
        })
        .then(html => $mainContainer.html(html))
        .then(() => {
            $(() => {
                $('#edit-thread-category').val(data.category);
            });

            const $btnEditThread = $('#btn-thread-edit');

            const $threadEditTitle = $('#edit-thread-title');
            const $threadEditContent = $('#edit-thread-content');
            const $threadEditImageUrl = $('#edit-thread-image-url');
            const $threadEditTags = $('#edit-thread-tags');
            const $threadEditCategory = $('#edit-thread-category');

            const $formThreadEditTitle = $('#form-edit-thread-title');
            const $formThreadEditContent = $('#form-edit-thread-content');
            const $formThreadEditImageUrl = $('#form-edit-thread-image-url');
            const $formThreadEditTags = $('#form-edit-thread-tags');

            $btnEditThread.on('click', () => {
                let thread;
                try {
                    thread = new Thread($threadEditTitle.val(), $threadEditImageUrl.val(),
                        $threadEditTags.val(), $threadEditCategory.val(), $threadEditContent.val());
                } catch (error) {
                    if (error.message.indexOf('Title') == 0) {
                        toastr.error(error.message);
                        $formThreadEditTitle.addClass('has-error');
                        $threadEditTitle.focus();
                        return;
                    } else {
                        $formThreadEditTitle.removeClass('has-error');
                    }

                    if (error.message.indexOf('URL') > -1) {
                        toastr.error(error.message);
                        $formThreadEditImageUrl.addClass('has-error');
                        !$threadEditImageUrl.focus();
                        return;
                    } else {
                        $formThreadEditImageUrl.removeClass('has-error');
                    }

                    if (error.message.indexOf('Tags') > -1) {
                        toastr.error(error.message);
                        $formThreadEditTags.addClass('has-error');
                        !$threadEditTags.focus();
                        return;
                    } else {
                        $formThreadEditTags.removeClass('has-error');
                    }

                    if (error.message.indexOf('category') > -1) {
                        toastr.error(error.message);
                        return;
                    }

                    if (error.message.indexOf('Content') > -1) {
                        toastr.error('Thread content length must be between 5 and 2000 symbols!');
                        $formThreadEditContent.addClass('has-error');
                        !$threadEditContent.focus();
                        return;
                    } else {
                        $formThreadEditContent.removeClass('has-error');
                    }
                }

                $('.form-group').removeClass('has-error').addClass('has-success');
                $btnEditThread.attr('diasabled', true);

                forumService.editThread(id, thread.title, thread.content, thread.imageUrl, thread.category, thread.tags)
                    .then(() => {
                        toastr.success('Thread successfully edited!');
                        $(location).attr('href', `#!/forum/details/${id}`);
                    })
                    .catch(error => {
                        console.log(error);
                        toastr.error('An error occured! Check if your data is valid or try again later!');
                        $btnEditThread.attr('diasabled', false);
                    });
            });

            let $btnRestore = $('#btn-restore-thread');
            $btnRestore.on('click', () => {
                $btnRestore.attr('disabled', true);

                forumService.flagThreadAsActive(params.id)
                    .then(() => {
                        toastr.success('Thread restored');
                    })
                    .catch(error => {
                        console.log(error);
                        toastr.error('An error occured!');
                        $btnRestore.attr('disabled', false);
                    });
            });
        })
        .catch(error => {
            console.log(error);
            toastr.error('An error occured!');
        });
}

function flagDeleteThread(params) {
    let id = params.id;

    forumService.flagThreadAsDeleted(id)
        .then(() => {
            toastr.success('Thread deleted!');
            $(location).attr('href', '#!/forum');
        })
        .catch(error => {
            console.log(error);
            toastr.error('An error occured!');
        });
}

export { getMainPage, getCreatePage, getCategoryPage, getThread, getEditThreadPage, flagDeleteThread };