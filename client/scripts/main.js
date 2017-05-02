import 'jquery';
import 'bootstrap';
import Navigo from 'navigo';
import * as controllers from 'controllers';
import { toggleButtonsIfLoggedIn } from 'utils';

toggleButtonsIfLoggedIn();

const router = new Navigo(null, false);

router
    .on('/home', controllers.home.get)
    .on('/register', controllers.auth.register)
    .on('/login', controllers.auth.login)
    .on('/logout', controllers.auth.logout)
    .on('/profile', controllers.auth.profile)
    .on('/news/create', controllers.news.getCreatePage)
    .on('/news/:page', controllers.news.getAll)
    .on('/news/edit/:id', controllers.news.getEditPage)
    .on('/news/delete/:id', controllers.news.flagNewsEntryAsDeleted)
    .on('/news/details/:id', controllers.news.getById)
    .on('/news', controllers.news.getAll)
    .on('/articles/create', controllers.articles.getCreateArticlePage)
    .on('/articles', controllers.articles.getAllArticles)
    .on('/articles/details:id', controllers.articles.getArticleById)
    .resolve();

