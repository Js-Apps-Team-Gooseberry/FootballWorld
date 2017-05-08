import * as requester from 'requester';

function register(username, password, email, profilePicture) {
    let body = {
        username,
        password,
        email,
        profilePicture
    };

    return requester.postJSON('/api/auth/register', body);
}

function login(username, password) {
    let body = {
        username,
        password
    };
    
    return requester.putJSON('/api/auth/login', body);
}

function getById(id) {
    return requester.getJSON(`/api/auth/get-by-id/${id}`);
}

function updateUserInfo(id, username, profilePicture, email, isAdmin) {
    let body = {
        username,
        profilePicture,
        email,
        isAdmin
    };

    return requester.putJSON(`/api/auth/update-user-info/${id}`, body);
}

function blockUser(id) {
    return requester.putJSON(`/api/auth/block-user/${id}`);
}

function unblockUser(id) {
    return requester.putJSON(`/api/auth/unblock-user/${id}`);
}

function changePassword(id, oldPassword, newPassword) {
    let body = {
        oldPassword,
        newPassword
    };

    return requester.putJSON(`/api/auth/change-password/${id}`, body);
}

function getByUsername(username) {
    return requester.getJSON(`/api/auth/get-by-username/${username}`);
}

export {
    register,
    login,
    getById,
    updateUserInfo,
    blockUser,
    unblockUser,
    changePassword,
    getByUsername
};