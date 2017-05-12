import Navigo from 'navigo';
import * as controllers from 'controllers';

function start() {
    const router = new Navigo(null, true, '#!');

    router
        .on('/home', controllers.home.getHomePage)
        .on('/search', controllers.home.getSearchPage)

        // auth
        .on('/register', controllers.auth.register)
        .on('/login', controllers.auth.login)
        .on('/logout', controllers.auth.logout)
        .on('/profile/:username', controllers.auth.previewProfile)
        .on('/profile', controllers.auth.profile)
        .on('/change-password', controllers.auth.changePassword)
        .on('/update-profile/:id', controllers.auth.updateProfile)

        // admin
        .on('/admin/news', controllers.admin.getNewsPage)
        .on('/admin/articles', controllers.admin.getArticlesPage)
        .on('/admin/users', controllers.admin.getUsersPage)
        .on('/admin/forum', controllers.admin.getForumPage)
        .on('/admin/forum/create-category', controllers.admin.getCreateCategoryPage)

        // news
        .on('/news/create', controllers.news.getCreatePage)
        .on('/news/:page', controllers.news.getAll)
        .on('/news/edit/:id', controllers.news.getEditPage)
        .on('/news/delete/:id', controllers.news.flagNewsEntryAsDeleted)
        .on('/news/details/:id', controllers.news.getById)
        .on('/news', controllers.news.getAll)

        // forum
        .on('/forum/details/:id/:page', controllers.forum.getThread)
        .on('/forum/details/:id', controllers.forum.getThread)
        .on('/forum/delete/:id', controllers.forum.flagDeleteThread)
        .on('/forum/edit/:id', controllers.forum.getEditThreadPage)
        .on('/forum/create', controllers.forum.getCreatePage)
        .on('/forum/:category/:page', controllers.forum.getCategoryPage)
        .on('/forum/:category', controllers.forum.getCategoryPage)
        .on('/forum', controllers.forum.getMainPage)

        //articles
        .on('/articles/create', controllers.articles.getCreateArticlePage)
        .on('/articles', controllers.articles.getAllArticles)
        .on('/articles/:page', controllers.articles.getAllArticles)
        .on('/articles/delete/:id', controllers.articles.flagArticlesAsDeleted)
        .on('/articles/details/:id', controllers.articles.getArticleById)
        .on('articles/edit/:id', controllers.articles.getEditArticlePage)

        // default action
        .on('*', controllers.home.getHomePage)
        .resolve();
}

export { start };