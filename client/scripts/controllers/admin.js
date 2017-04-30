import { compile } from 'templates-compiler';
import $ from 'jquery';

const $mainContainer = $('#main-container');

function getMainAdminPage() {
    compile('admin')
        .then(html => $mainContainer.html(html));
}

export { getMainAdminPage };
