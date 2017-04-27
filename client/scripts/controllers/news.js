import {compile} from 'templates-compiler';
import $ from 'jquery';

const $mainContainer = $('#main-container');

function loadNews() {
    compile('news')
        .then(html=> $mainContainer.html(html));
}

export { loadNews };