import $ from 'jquery';
import 'bootstrap';
import Navigo from 'navigo';
import * as controllers from 'controllers';
import { toggleButtonsIfLoggedIn } from 'utils';

toggleButtonsIfLoggedIn();

const router = new Navigo(null, true, '#!');

router
    .on('/home', controllers.home.get)
    .on('/register', controllers.auth.register)
    .on('/login', controllers.auth.login)
    .on('/logout', controllers.auth.logout)
    .on('/profile/:username', controllers.auth.previewProfile)
    .on('/profile', controllers.auth.profile)
    .on('/change-password', controllers.auth.changePassword)
    .on('/update-profile/:id', controllers.auth.updateProfile)
    .on('/admin/news', controllers.admin.getNewsPage)
    .on('/admin/articles', controllers.admin.getArticlesPage)
    .on('/admin/users', controllers.admin.getUsersPage)
    .on('/admin/forum', controllers.admin.getForumPage)
    .on('/admin/forum/create-category', controllers.admin.getCreateCategoryPage)
    .on('/news/create', controllers.news.getCreatePage)
    .on('/news/:page', controllers.news.getAll)
    .on('/news/edit/:id', controllers.news.getEditPage)
    .on('/news/delete/:id', controllers.news.flagNewsEntryAsDeleted)
    .on('/news/details/:id', controllers.news.getById)
    .on('/news', controllers.news.getAll)
    .on('/forum/details/:id/:page', controllers.forum.getThread)
    .on('/forum/details/:id', controllers.forum.getThread)
    .on('/forum/delete/:id', controllers.forum.flagDeleteThread)
    .on('/forum/edit/:id', controllers.forum.getEditThreadPage)
    .on('/forum/create', controllers.forum.getCreatePage)
    .on('/forum/:category/:page', controllers.forum.getCategoryPage)
    .on('/forum/:category', controllers.forum.getCategoryPage)
    .on('/forum', controllers.forum.getMainPage)
    .on('/articles/create', controllers.articles.getCreateArticlePage)
    .on('/articles', controllers.articles.getAllArticles)
    .on('/articles/:page', controllers.articles.getAllArticles)
    .on('/articles/details/:id', controllers.articles.getArticleById)
    .on('articles/edit/:id',controllers.articles.editArticle)
    .on('*', controllers.home.get)
    .resolve();

$('#navbar-main').on('click', 'ul li a', () => {
    $('#navbar-main').collapse('hide');
});

$('#btn-facebook-share-site').click((ev) => {
    ev.preventDefault();
    window.open(
        $('#btn-facebook-share-site').attr('href'),
        'popupWindow',
        'width=600,height=600'
    );
});