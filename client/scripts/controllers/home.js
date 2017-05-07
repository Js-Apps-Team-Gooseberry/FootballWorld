import { compile } from 'templates-compiler';
import $ from 'jquery';
import * as statsService from 'stats-service';

const $mainContainer = $('#main-container');

function get() {
    statsService.getStandings()
        .then(standings => {
            return compile('home', standings);
        })    
        .then(html => $mainContainer.html(html));
}

export { get };
