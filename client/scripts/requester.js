import $ from 'jquery';

function apiGetJSON(url, headers = {}) {
    headers['X-Auth-Token'] = 'd0063ff1d3264556a92143db04f9b24a';
    return ajax('GET', url, null, headers);
}

function get(url) {
    return ajax('GET', url, null, null);
}

function getJSON(url, headers = {}) {
    return ajaxWithSetHeaders('GET', url, null, headers);
}

function putJSON(url, body, headers = {}) {
    return ajaxWithSetHeaders('PUT', url, body, headers);
}

function postJSON(url, body, headers = {}) {
    return ajaxWithSetHeaders('POST', url, body, headers);
}

function deleteJSON(url, body, headers = {}) {
    return ajaxWithSetHeaders('DELETE', url, body, headers);
}

function ajaxWithSetHeaders(method, url, body, headers = {}) {
    headers.authorization = localStorage.getItem('token');
    headers['content-type'] = 'application/json';
    return ajax(method, url, body, headers);
}

function ajax(method, url, body, headers = {}) {
    let timeout = setTimeout(() => {
        $('#loader').show();
    }, 300);
    return new Promise((resolve, reject) => {
        $.ajax({
            url,
            headers,
            method,
            data: JSON.stringify(body)
        })
            .done(result => {
                clearTimeout(timeout);
                $('#loader').hide();
                return resolve(result);
            })
            .fail(error => {
                clearTimeout(timeout);
                $('#loader').hide();
                return reject(error);
            });
    });
}

export { get, getJSON, postJSON, putJSON, deleteJSON, apiGetJSON };