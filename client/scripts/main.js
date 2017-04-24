import 'jquery';
import 'bootstrap';
import Navigo from 'navigo';
import * as controllers from 'controllers';

const router = new Navigo(null, false);

router
    .on('/home', controllers.home.get)
    .on('/register', controllers.auth.register)
    .on('/login', controllers.auth.login)    
    .on('*', controllers.home.get)
    .resolve();