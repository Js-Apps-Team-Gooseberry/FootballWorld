import {compile} from 'templates-compiler';
import $ from 'jquery';

const $mainContainer = $('#main-container');

function loadArticle() {
    compile('article')
        .then(html=> $mainContainer.html(html));
}

export { loadArticle };