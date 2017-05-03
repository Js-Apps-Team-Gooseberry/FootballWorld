import { compile } from 'templates-compiler';
import * as forumService from 'forum-service';
import $ from 'jquery';

const $mainContainer = $('#main-container');

function getMainPage() {
    let data = {
        sections: [
            {
                title: 'TsarFootball',
                description: 'Forum rules, issue reports, requests, feedback, etc.',
                imageUrl: '/public/assets/logo-page.png',
                link: 'site'
            },
            {
                title: 'Teams',
                description: 'Let your opinion be heard amongst other supporters of your favourite team.',
                imageUrl: '/public/assets/forum-teams.jpg',
                link: 'teams'
            },
            {
                title: 'Premier League Games',
                description: 'Upcoming games, results or just classic games.',
                imageUrl: '/public/assets/forum-games.jpg',
                link: 'games'
            },
            {
                title: 'Media Watch',
                description: 'News, transfers, interviews - discuss or share what you know.',
                imageUrl: '/public/assets/forum-media.jpg',
                link: 'media'
            },
            {
                title: 'Free Zone',
                description: 'Free discussions zone. Whatever doesn\'t fit other sections fits here.',
                imageUrl: '/public/assets/forum-free-zone.jpg',
                link: 'free'
            }
        ]
    };

    compile('forum/main', data)
        .then(html => $mainContainer.html(html));
}

export { getMainPage };