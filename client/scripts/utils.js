import $ from 'jquery';

function checkIfLoggedIn() {
    if (localStorage.getItem('currentUser') != undefined) {
        $('.logged-out').addClass('hidden');
        $('.logged-in').removeClass('hidden');
    } else {
        $('.logged-out').removeClass('hidden');
        $('.logged-in').addClass('hidden');
    }
}

export { checkIfLoggedIn };