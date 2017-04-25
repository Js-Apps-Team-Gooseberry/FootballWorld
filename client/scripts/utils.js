import $ from 'jquery';

function toggleButtonsIfLoggedIn() {
    if (localStorage.getItem('currentUser') != undefined) {
        $('.logged-out').addClass('hidden');
        $('.logged-in').removeClass('hidden');
    } else {
        $('.logged-out').removeClass('hidden');
        $('.logged-in').addClass('hidden');
    }
}

export { toggleButtonsIfLoggedIn };