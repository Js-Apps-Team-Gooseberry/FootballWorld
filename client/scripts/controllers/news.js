import { compile } from 'templates-compiler';
import $ from 'jquery';

const $mainContainer = $('#main-container');

function getAll() {
    compile('news-list')
        .then(html => $mainContainer.html(html));
}

export { getAll };
