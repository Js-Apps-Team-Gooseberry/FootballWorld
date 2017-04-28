import $ from 'jquery';

function get(url) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url,
            method: 'GET'
        })
            .done(resolve)
            .fail(reject);
    });
}

function getJSON(url, headers = {}) {
    headers.authorization = localStorage.getItem('token');

    return new Promise((resolve, reject) => {
        $.ajax({
            url,
            method: 'GET',
            headers: headers,
            contentType: 'application/json'
        })
            .done(resolve)
            .fail(reject);
    });
}

function putJSON(url, body, headers = {}) {
    headers.authorization = localStorage.getItem('token');
    
    return new Promise((resolve, reject) => {
        $.ajax({
            url,
            headers,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(body)
        })
            .done(resolve)
            .fail(reject);
    });
}

function postJSON(url, body, headers = {}) {
    headers.authorization = localStorage.getItem('token');
    
    return new Promise((resolve, reject) => {
        $.ajax({
            url,
            headers,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(body)
        })
            .done(resolve)
            .fail(reject);
    });
}

function deleteJSON(url, body, headers = {}) {
    headers.authorization = localStorage.getItem('token');
    
    return new Promise((resolve, reject) => {
        $.ajax({
            url,
            headers,
            method: 'DELETE',
            contentType: 'application/json',
            data: JSON.stringify(body)
        })
            .done(resolve)
            .fail(reject);
    });
}

export { get, getJSON, postJSON, putJSON, deleteJSON };