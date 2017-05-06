import * as requester from 'requester';

function register(user) {
    return requester.postJSON('/api/auth/register', user);
}

function login(user) {
    return requester.putJSON('/api/auth/login', user);
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

export {
    register,
    login,
    getById,
    updateUserInfo,
    blockUser,
    unblockUser,
    changePassword
};