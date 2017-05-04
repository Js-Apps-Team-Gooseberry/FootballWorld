import { compile } from 'templates-compiler';
import * as forumService from 'forum-service';
import * as toastr from 'toastr';
import $ from 'jquery';

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
            let data = {
                category: category,
                threads: response
            };

            return compile('forum/category', data);
        })
        .then(html => $mainContainer.html(html))
        .catch(console.log);
}

function getThread(params) {
    let id = params.id;

    forumService.getById(id)
        .then(data => {
            return compile('forum/details', data);
        })
        .then(html => $mainContainer.html(html))
        .then(() => {
            const $btnNewPost = $('#btn-new-post'),
                $newPostContent = $('#new-post-input'),
                $formNewPost = $('#form-new-post');

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

                forumService.createNewPost(id, content)
                    .then(result => {
                        let post = result.posts[result.posts.length - 1];
                        return compile('forum/post', post);
                    })
                    .then(html => {
                        $('#posts-container').append(html);
                        toastr.success('Post successfully created!');
                        $newPostContent.val('');
                        $newPostContent.attr('disabled', false);
                        $btnNewPost.attr('disabled', false);
                    })
                    .catch(error => {
                        toastr.error('An error occured!');
                        console.log(error);
                        $newPostContent.attr('disabled', false);
                        $btnNewPost.attr('disabled', false);
                    });
            });
        })
        .catch(error => {
            console.log(error);
            toastr.error('An error occured!');
            $(location).attr('href', '#!/forum');
        });
}

function getEditThreadPage(params) {
    let id = params.id;
    let data = {};

    forumService.getById(id)
        .then(thread => {
            thread.tags = thread.tags.join(', ');
            data = thread;

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