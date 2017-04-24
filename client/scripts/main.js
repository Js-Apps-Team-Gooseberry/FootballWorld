import 'jquery';
import 'bootstrap';
import * as toastr from 'toastr';
import Navigo from 'navigo';
import * as controllers from 'controllers';

const router = new Navigo(null, false);

router
    .on('/home', controllers.home.get)
    .on('/register', controllers.auth.register)
    .resolve();


toastr.success('Welcome!');