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

function isLoggedIn() {
    if (!localStorage.getItem('currentUser')) {
        return false;
    }

    return true;
}

function isAdmin() {
    if (!localStorage.getItem('currentUser')) {
        return false;
    }

    let user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user.admin) {
        return false;
    }

    return true;
}

function isAuthorized(authorId) {
    if (!localStorage.getItem('currentUser')) {
        return false;
    }

    let user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user.admin && user._id != authorId) {
        return false;
    }

    return true;
}

function formatDate(date) {
    let monthNames = [
        'January', 'February', 'March',
        'April', 'May', 'June', 'July',
        'August', 'September', 'October',
        'November', 'December'
    ];

    date = new Date(date);

    let day = _formatNumber(date.getDate());
    let monthIndex = date.getMonth();
    let year = date.getFullYear();
    let hours = _formatNumber(date.getHours());
    let minutes = _formatNumber(date.getMinutes());

    return `${day} ${monthNames[monthIndex]} ${year}, ${hours}:${minutes}`;
}

function _formatNumber(number) {
    return number.toString().length < 2 ? `0${number}` : number;
}

function validateStringLength(string, minLength, maxLength, validationTarget) {
    if (!string || string.trim().length < minLength || string.trim().length > maxLength) {
        throw new Error(`${validationTarget} length should be between ${minLength} and ${maxLength} symbols!`);
    }
}

function validateEmail(email) {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regex.test(email)) {
        throw new Error('Please enter a valid E-Mail!');
    }
}

function changeMainContainerHtml(html) {
    $('#main-container').html(html);
}

export {
    toggleButtonsIfLoggedIn,
    formatDate,
    isLoggedIn,
    isAdmin,
    isAuthorized,
    validateStringLength,
    validateEmail,
    changeMainContainerHtml
};