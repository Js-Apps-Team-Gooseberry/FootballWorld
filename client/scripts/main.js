import 'bootstrap';
import * as routing from 'routing';
import * as utils from 'utils';

utils.toggleButtonsIfLoggedIn();
utils.bindHomePageEvents();

routing.start();