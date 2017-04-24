import * as requester from 'requester';

function register(user) {
    return requester.postJSON('/api/auth/register', user);
}

function login(user) {
    return requester.putJSON('/api/auth/login', user);
}

export { register, login };