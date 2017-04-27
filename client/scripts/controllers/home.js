import { compile } from 'templates-compiler';
import $ from 'jquery';

const $mainContainer = $('#main-container');

function get() {
    compile('home')
        .then(html => $mainContainer.html(html));
}

export { get };

