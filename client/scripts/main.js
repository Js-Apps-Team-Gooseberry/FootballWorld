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
    .on('/article', controllers.news.loadNews)
<<<<<<< HEAD
    .on('*', controllers.home.get)
=======
>>>>>>> b1d855e5897157215e5ca9fc7f401b0fab4915e5
    .resolve();

