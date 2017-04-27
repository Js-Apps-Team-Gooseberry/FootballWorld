import 'jquery';
import 'bootstrap';
import Navigo from 'navigo';
import * as controllers from 'controllers';
import { checkIfLoggedIn } from 'utils';

checkIfLoggedIn();

const router = new Navigo(null, false);

router
    .on('/home', controllers.home.get)
    .on('/register', controllers.auth.register)
    .on('/login', controllers.auth.login)
    .on('/logout', controllers.auth.logout)
    .on('/profile', controllers.auth.profile)
    .on('/news', controllers.news.loadNews)
    .on('*', controllers.home.get)
    .resolve();

