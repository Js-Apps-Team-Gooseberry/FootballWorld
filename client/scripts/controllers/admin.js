import { compile } from 'templates-compiler';
import $ from 'jquery';
import * as adminService from 'admin-service';
import * as toastr from 'toastr';
import { isAdmin } from 'utils';

const $mainContainer = $('#main-container');

function getNewsPage(params, query) {
    if (!isAdmin()) {
        toastr.error('Unauthorized!');
        $(location).attr('href', '#!/home');
        return;
    }

    let queryDictionary = {};
    if (query) {
        let queryArr = query.split('&').map(x => x.trim()).filter(x => x != '');
        for (let queryPair of queryArr) {
            let key = queryPair.split('=').map(x => x.trim()).filter(x => x != '')[0];
            let value = queryPair.split('=').map(x => x.trim()).filter(x => x != '')[1];
            queryDictionary[key] = value;
        }
    }

    let page = +queryDictionary.page || 1;
    let searchQuery = queryDictionary.query || '!-!';
    let sort = queryDictionary.sort || 'date';

    adminService.getAllNews(page, searchQuery, sort)
        .then(data => {
            data.query = searchQuery;
            data.sort = sort;
            data.pagination = {
                pageCount: data.pagesCount,
                page
            };

            return compile('admin/news', data);
        })
        .then(html => $mainContainer.html(html))
        .then(() => {
            const $newsSearch = $('#admin-news-search');
            $newsSearch.on('change', () => {
                $(location).attr('href', `#!/admin/news?query=${$newsSearch.val()}&sort=${sort}`);
            });
            let queryVal = searchQuery != '!-!' ? searchQuery : '';
            $newsSearch.val(queryVal);

            const $newsStatus = $('#admin-news-status');
            $newsStatus.on('change', () => {
                $(location).attr('href', `#!/admin/news?query=${queryVal}&sort=${$newsStatus[0].selectedOptions[0].value}`);
            });

            $(`option[value='${sort}']`).attr('selected', 'selected');

            $('.btn-news-delete-premanently').on('click', (ev) => {
                if (ev.isDefaultPrevented()) {
                    return;
                }

                $(ev.target).addClass('disabled');
                $(ev.target).attr('disabled', true);

                let id = $(ev.target).parent().parent().attr('id');
                adminService.deltePermanentlyNewsEntry(id)
                    .then(response => {
                        console.log(response);
                        toastr.success('Article permanently deleted!');
                        $(`#${id}`).remove();
                    })
                    .catch(error => {
                        console.log(error);
                        toastr.error('An error occured!');

                        $(ev.target).addClass('disabled');
                        $(ev.target).attr('disabled', true);
                    });
            });
        });
}

function getArticlesPage(params, query) {
    if (!isAdmin()) {
        toastr.error('Unauthorized!');
        $(location).attr('href', '#!/home');
        return;
    }

    let queryDictionary = {};
    if (query) {
        let queryArr = query.split('&').map(x => x.trim()).filter(x => x != '');
        for (let queryPair of queryArr) {
            let key = queryPair.split('=').map(x => x.trim()).filter(x => x != '')[0];
            let value = queryPair.split('=').map(x => x.trim()).filter(x => x != '')[1];
            queryDictionary[key] = value;
        }
    }

    let page = +queryDictionary.page || 1;
    let searchQuery = queryDictionary.query || '!-!';
    let sort = queryDictionary.sort || 'date';

    adminService.getAllArticles(page, searchQuery, sort)
        .then(data => {
            data.query = searchQuery;
            data.sort = sort;
            data.pagination = {
                pageCount: data.pagesCount,
                page
            };

            return compile('admin/articles', data);
        })
        .then(html => $mainContainer.html(html))
        .then(() => {
            const $articlesSearch = $('#admin-articles-search');
            $articlesSearch.on('change', () => {
                $(location).attr('href', `#!/admin/articles?query=${$articlesSearch.val()}&sort=${sort}`);
            });
            let queryVal = searchQuery != '!-!' ? searchQuery : '';
            $articlesSearch.val(queryVal);

            const $articleStatus = $('#admin-news-status');
            $articleStatus.on('change', () => {
                $(location).attr('href', `#!/admin/articles?query=${queryVal}&sort=${$articleStatus[0].selectedOptions[0].value}`);
            });

            $(`option[value='${sort}']`).attr('selected', 'selected');

            $('.btn-articles-delete-premanently').on('click', (ev) => {
                if (ev.isDefaultPrevented()) {
                    return;
                }

                $(ev.target).addClass('disabled');
                $(ev.target).attr('disabled', true);

                let id = $(ev.target).parent().parent().attr('id');
                adminService.deleteArticlePermanently(id)
                    .then(response => {
                        console.log(response);
                        toastr.success('Article permanently deleted!');
                        $(`#${id}`).remove();
                    })
                    .catch(error => {
                        console.log(error);
                        toastr.error('An error occured!');

                        $(ev.target).addClass('disabled');
                        $(ev.target).attr('disabled', true);
                    });
            });
        });
}

function getUsersPage(params, query) {
    if (!isAdmin()) {
        toastr.error('Unauthorized!');
        $(location).attr('href', '#!/home');
        return;
    }

    let queryDictionary = {};
    if (query) {
        let queryArr = query.split('&').map(x => x.trim()).filter(x => x != '');
        for (let queryPair of queryArr) {
            let key = queryPair.split('=').map(x => x.trim()).filter(x => x != '')[0];
            let value = queryPair.split('=').map(x => x.trim()).filter(x => x != '')[1];
            queryDictionary[key] = value;
        }
    }

    let page = +queryDictionary.page || 1;
    let searchQuery = queryDictionary.query || '!-!';
    let sort = queryDictionary.sort || 'date';

    adminService.getAllUsers(page, searchQuery, sort)
        .then((data) => {
            data.query = searchQuery;
            data.sort = sort;
            data.pagination = {
                pageCount: data.pagesCount,
                page
            };
            console.log(data);
            return compile('admin/users', data);
        })
        .then(html => $mainContainer.html(html))
        .then(() => {
            const $usersSearch = $('#admin-users-search');
            $usersSearch.on('change', () => {
                $(location).attr('href', `#!/admin/users?query=${$usersSearch.val()}&sort=${sort}`);
            });
            let queryVal = searchQuery != '!-!' ? searchQuery : '';
            $usersSearch.val(queryVal);

            const $usersStatus = $('#admin-users-status');
            $usersStatus.on('change', () => {
                $(location).attr('href', `#!/admin/users?query=${queryVal}&sort=${$usersStatus.val()}`);
            });

            $(`option[value='${sort}']`).attr('selected', 'selected');

            $('.btn-user-delete-premanently').on('click', (ev) => {
                if (ev.isDefaultPrevented()) {
                    return;
                }

                $(ev.target).addClass('disabled');
                $(ev.target).attr('disabled', true);

                let id = $(ev.target).parent().parent().attr('id');
                adminService.deleteUser(id)
                    .then(response => {
                        toastr.success(response);
                        $(`#${id}`).remove();
                    })
                    .catch(error => {
                        console.log(error);
                        toastr.error('An error occured!');

                        $(ev.target).removeClass('disabled');
                        $(ev.target).attr('disabled', false);
                    });
            });
        });
}

function getForumPage(params, query) {
    if (!isAdmin()) {
        toastr.error('Unauthorized!');
        $(location).attr('href', '#!/home');
        return;
    }

    let queryDictionary = {};
    if (query) {
        let queryArr = query.split('&').map(x => x.trim()).filter(x => x != '');
        for (let queryPair of queryArr) {
            let key = queryPair.split('=').map(x => x.trim()).filter(x => x != '')[0];
            let value = queryPair.split('=').map(x => x.trim()).filter(x => x != '')[1];
            queryDictionary[key] = value;
        }
    }

    let page = +queryDictionary.page || 1;
    let searchQuery = queryDictionary.query || '!-!';
    let sort = queryDictionary.sort || 'date';

    adminService.getAllThreads(page, searchQuery, sort)
        .then((data) => {
            data.query = searchQuery;
            data.sort = sort;
            data.pagination = {
                pageCount: data.pagesCount,
                page
            };

            return compile('admin/forum', data);
        })
        .then(html => $mainContainer.html(html))
        .then(() => {
            const $forumSearch = $('#admin-forum-search');
            $forumSearch.on('change', () => {
                $(location).attr('href', `#!/admin/forum?query=${$forumSearch.val()}&sort=${sort}`);
            });
            let queryVal = searchQuery != '!-!' ? searchQuery : '';
            $forumSearch.val(queryVal);

            const $forumStatus = $('#admin-forum-status');
            $forumStatus.on('change', () => {
                $(location).attr('href', `#!/admin/forum?query=${queryVal}&sort=${$forumStatus.val()}`); //[0].selectedOptions[0].value}`);
            });

            $(`option[value='${sort}']`).attr('selected', 'selected');

            $('.btn-forum-delete-premanently').on('click', (ev) => {
                if (ev.isDefaultPrevented()) {
                    return;
                }

                $(ev.target).addClass('disabled');
                $(ev.target).attr('disabled', true);

                let id = $(ev.target).parent().parent().attr('id');
                adminService.deleteThreadPermanently(id)
                    .then(response => {
                        console.log(response);
                        toastr.success('Thread permanently deleted!');
                        $(`#${id}`).remove();
                    })
                    .catch(error => {
                        console.log(error);
                        toastr.error('An error occured!');

                        $(ev.target).removeClass('disabled');
                        $(ev.target).attr('disabled', false);
                    });
            });
        });
}

function getCreateCategoryPage() {
    if (!isAdmin()) {
        toastr.error('Unauthorized!');
        $(location).attr('href', '#!/home');
        return;
    }

    compile('forum/create-category')
        .then(html => $mainContainer.html(html))
        .then(() => {
            $('#btn-category-create').on('click', () => {
                const categoryTitle = $('#create-category-title').val().trim(),
                    categoryDescription = $('#create-category-description').val().trim(),
                    categoryLinkName = $('#create-category-link-name').val().trim(),
                    categoryImageUrl = $('#create-category-image-url').val().trim();

                if (!categoryTitle || !categoryDescription || !categoryLinkName || !categoryImageUrl) {
                    toastr.error('All fields are required!');
                    return;
                }

                adminService.createNewCategory(categoryTitle, categoryDescription, categoryLinkName, categoryImageUrl)
                    .then(() => {
                        toastr.success('Category successfully created!');
                        $(location).attr('href', '#!/forum');
                    })
                    .catch(error => {
                        console.log(error);
                        toastr.error('An error occured!');
                    });
            });
        })
        .catch(error => {
            console.log(error);
            toastr.error('An error occured!');
        });
}

export { getNewsPage, getArticlesPage, getUsersPage, getForumPage, getCreateCategoryPage };
