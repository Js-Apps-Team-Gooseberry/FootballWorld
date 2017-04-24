import * as requester from 'requester';

function register(user) {
    return requester.postJSON('/api/auth/register', user);
}

export { register };