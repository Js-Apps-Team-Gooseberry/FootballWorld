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

function getArticlesPage() {
    compile('admin/articles')
        .then(html => $mainContainer.html(html));
}

function getUsersPage() {
    compile('admin/users')
        .then(html => $mainContainer.html(html));
}

function getForumPage() {
    compile('admin/forum')
        .then(html => $mainContainer.html(html));
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
