import { compile } from 'templates-compiler';
import * as forumService from 'forum-service';
import * as toastr from 'toastr';
import $ from 'jquery';
import { isLoggedIn, isAuthorized } from 'utils';

const $mainContainer = $('#main-container');

function getMainPage() {
    let data = {
        sections: [
            {
                title: 'TsarFootball',
                description: 'Forum rules, issue reports, requests, feedback, etc.',
                imageUrl: '/public/assets/logo-page.png',
                link: 'Website'
            },
            {
                title: 'Teams',
                description: 'Let your opinion be heard amongst other supporters of your favourite team.',
                imageUrl: '/public/assets/forum-teams.jpg',
                link: 'Teams'
            },
            {
                title: 'Premier League Games',
                description: 'Upcoming games, results or just classic games.',
                imageUrl: '/public/assets/forum-games.jpg',
                link: 'Games'
            },
            {
                title: 'Media Watch',
                description: 'News, transfers, interviews - discuss or share what you know.',
                imageUrl: '/public/assets/forum-media.jpg',
                link: 'Media Watch'
            },
            {
                title: 'Free Zone',
                description: 'Free discussions zone. Whatever doesn\'t fit other sections fits here.',
                imageUrl: '/public/assets/forum-free-zone.jpg',
                link: 'Free Zone'
            }
        ]
    };

    compile('forum/main', data)
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
                if (!$threadCreateTitle.val().trim() || $threadCreateTitle.val().trim().length < 5 || $threadCreateTitle.val().trim().length > 50) {
                    toastr.error('Thread title length must be between 5 and 50 symbols!');
                    $formThreadCreateTitle.addClass('has-error');
                    !$threadCreateTitle.focus();
                    return;
                } else {
                    $formThreadCreateTitle.removeClass('has-error');
                }

                if (!$threadCreateImageUrl.val().trim() || $threadCreateImageUrl.val().trim().length < 5) {
                    toastr.error('Please enter a valid URL!');
                    $formThreadCreateImageUrl.addClass('has-error');
                    !$threadCreateImageUrl.focus();
                    return;
                } else {
                    $formThreadCreateImageUrl.removeClass('has-error');
                }

                if (!$threadCreateTags.val().trim()) {
                    toastr.error('Please enter at least one tag! Helps with searching the threads!');
                    $formThreadCreateTags.addClass('has-error');
                    !$threadCreateTags.focus();
                    return;
                } else {
                    $formThreadCreateTags.removeClass('has-error');
                }

                if (!$threadCreateContent.val().trim()) {
                    toastr.error('Thread content length must be between 5 and 2000 symbols!');
                    $formThreadCreateContent.addClass('has-error');
                    !$threadCreateContent.focus();
                    return;
                } else {
                    $formThreadCreateContent.removeClass('has-error');
                }

                $btnCreateThread.addClass('diasabled');
                $btnCreateThread.attr('diasabled', true);

                let title = $threadCreateTitle.val();
                let content = $threadCreateContent.val();
                let imageUrl = $threadCreateImageUrl.val();
                let tags = $threadCreateTags.val();
                let category = $threadCreateCategory.val();

                forumService.createThread(title, content, imageUrl, category, tags)
                    .then(response => {
                        console.log(response);
                        toastr.success('Thread successfully created!');
                        $(location).attr('href', `#!/forum/${category}`);
                    })
                    .catch(error => {
                        console.log(error);
                        toastr.error('An error occured! Check if your data is valid or try again later!');
                        $btnCreateThread.removeClass('diasabled');
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

    forumService.getAllNotDeletedThreadsByCategory(category, page)
        .then(response => {
            console.log(response);
            let pagination = {
                pageCount: response.pagesCount,
                page
            };

            let data = {
                category: category,
                threads: response.threads,
                pagination
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
                pagination.pageCount = Math.ceil(response.posts.length / pageSize);
                response.posts = response.posts.slice((page - 1) * pageSize, ((page - 1) * pageSize) + pageSize);
            }

            data = {
                thread: response,
                pagination,
                user
            };
            console.log(data);
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
                if (!$threadEditTitle.val().trim() || $threadEditTitle.val().trim().length < 5 || $threadEditTitle.val().trim().length > 50) {
                    toastr.error('Thread title length must be between 5 and 50 symbols!');
                    $formThreadEditTitle.addClass('has-error');
                    !$threadEditTitle.focus();
                    return;
                } else {
                    $formThreadEditTitle.removeClass('has-error');
                }

                if (!$threadEditImageUrl.val().trim() || $threadEditImageUrl.val().trim().length < 5) {
                    toastr.error('Please enter a valid URL!');
                    $formThreadEditImageUrl.addClass('has-error');
                    !$threadEditImageUrl.focus();
                    return;
                } else {
                    $formThreadEditImageUrl.removeClass('has-error');
                }

                if (!$threadEditTags.val().trim()) {
                    toastr.error('Please enter at least one tag! Helps with searching the threads!');
                    $formThreadEditTags.addClass('has-error');
                    !$threadEditTags.focus();
                    return;
                } else {
                    $formThreadEditTags.removeClass('has-error');
                }

                if (!$threadEditContent.val().trim()) {
                    toastr.error('Thread content length must be between 5 and 2000 symbols!');
                    $formThreadEditContent.addClass('has-error');
                    !$threadEditContent.focus();
                    return;
                } else {
                    $formThreadEditContent.removeClass('has-error');
                }

                $btnEditThread.addClass('diasabled');
                $btnEditThread.attr('diasabled', true);

                let title = $threadEditTitle.val();
                let content = $threadEditContent.val();
                let imageUrl = $threadEditImageUrl.val();
                let tags = $threadEditTags.val();
                let category = $threadEditCategory.val();

                forumService.editThread(id, title, content, imageUrl, category, tags)
                    .then(response => {
                        console.log(response);
                        toastr.success('Thread successfully edited!');
                        $(location).attr('href', `#!/forum/details/${id}`);
                    })
                    .catch(error => {
                        console.log(error);
                        toastr.error('An error occured! Check if your data is valid or try again later!');
                        $btnEditThread.removeClass('diasabled');
                        $btnEditThread.attr('diasabled', false);
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
        .then(response => {
            console.log(response);
            toastr.success('Thread deleted!');
            $(location).attr('href', '#!/forum');
        })
        .catch(error => {
            console.log(error);
            toastr.error('An error occured!');
        });
}

export { getMainPage, getCreatePage, getCategoryPage, getThread, getEditThreadPage, flagDeleteThread };