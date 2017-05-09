import $ from 'jquery';

function toggleButtonsIfLoggedIn() {
    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (user) {
        $('.logged-out').addClass('hidden');
        $('.logged-in').removeClass('hidden');

        if (user.admin) {
            $('.admin').removeClass('hidden');
        }
    } else {
        $('.logged-out').removeClass('hidden');
        $('.logged-in').addClass('hidden');
        $('.admin').addClass('hidden');
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

function isUrlValid(str) {
    let pattern = new RegExp('^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$', 'i');
    if (!pattern.test(str)) {
        throw new Error('Please enter a valid URL!');
    }
}

function searchQueryExtractor(query) {
    let queryDictionary = {};
    if (query) {
        let queryArr = query.split('&').map(x => x.trim()).filter(x => x != '');
        for (let queryPair of queryArr) {
            let key = queryPair.split('=').map(x => x.trim()).filter(x => x != '')[0];
            let value = queryPair.split('=').map(x => x.trim()).filter(x => x != '')[1];
            queryDictionary[key] = value;
        }
    }

    let page = +queryDictionary.page || 1;
    let searchQuery = queryDictionary.query || '!-!';
    let sort = queryDictionary.sort || 'date';

    return {
        page,
        query: searchQuery,
        sort
    };
}

export {
    toggleButtonsIfLoggedIn,
    formatDate,
    isLoggedIn,
    isAdmin,
    isAuthorized,
    validateStringLength,
    validateEmail,
    changeMainContainerHtml,
    searchQueryExtractor,
    isUrlValid
};