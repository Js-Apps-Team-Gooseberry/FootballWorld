import 'jquery';
import 'bootstrap';
import * as toastr from 'toastr';
import Navigo from 'navigo';
import * as controllers from 'home-controller';

const router = new Navigo(null, false);

router
    .on('/home', controllers.get)
    .resolve();


toastr.success('Welcome!');