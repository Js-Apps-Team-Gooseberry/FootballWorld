import { compile } from 'templates-compiler';
import * as authService from 'auth-service';
import * as toastr from 'toastr';
import $ from 'jquery';
import { toggleButtonsIfLoggedIn, isLoggedIn } from 'utils';
import { User } from 'user-model';

const $mainContainer = $('#main-container');

function login() {
    if (isLoggedIn()) {
        toastr.error('You are already logged in!');
        return;
    }

    compile('login')
        .then(html => $mainContainer.html(html))
        .then(() => {
            const $btnLogin = $('#btn-login');
            $btnLogin.on('click', () => {
                const $loginUsername = $('#login-username');
                const $formLoginUsername = $('#form-login-username');

                const $loginPassword = $('#login-password');
                const $formLoginPassword = $('#form-login-password');

                $btnLogin.attr('disabled', true);

                authService.login($loginUsername.val(), $loginPassword.val())
                    .then(response => {
                        localStorage.setItem('currentUser', JSON.stringify(response.user));
                        localStorage.setItem('token', response.token);
                        $loginPassword.val('');
                        toastr.success('Login successful!');
                        $(location).attr('href', '#!/home');
                        toggleButtonsIfLoggedIn();
                    })
                    .catch(error => {
                        if (error.status == 401) {
                            toastr.error('Invalid username or/and password!');
                            $formLoginUsername.addClass('has-error');
                            $formLoginPassword.addClass('has-error');
                        } else if (error.status == 403) {
                            toastr.error('Account blocked!');
                        } else {
                            toastr.error('An error occured! Please try again later!');
                            console.log(error);
                        }

                        $btnLogin.attr('disabled', false);
                    });
            });
        });
}

function logout() {
    if (!isLoggedIn()) {
        toastr.error('You are not logged in!');
        return;
    }

    localStorage.clear();
    toggleButtonsIfLoggedIn();
    $(location).attr('href', '#!/home');
    toastr.success('Successfully logged out!');
}

function profile() {
    let user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        compile('my-profile', user)
            .then(html => $mainContainer.html(html));
    } else {
        $(location).attr('href', '#!/login');
        toastr.error('You need to be logged in to view this page!');
    }
}

function register() {
    if (isLoggedIn()) {
        toastr.error('You are already logged in!');
        return;
    }

    compile('register')
        .then(html => $mainContainer.html(html))
        .then(() => {
            const $btnRegister = $('#btn-register');
            $btnRegister.on('click', () => {
                const $registerUsername = $('#register-username');
                const $formRegisterUsername = $('#form-register-username');
                const username = $registerUsername.val();

                const $registerPassword = $('#register-password');
                const $formRegisterPassword = $('#form-register-password');
                const password = $registerPassword.val();

                const $registerConfirmPassword = $('#register-confirm-password');
                const $formRegisterConfirmPassword = $('#form-register-confirm-password');
                const confirmPassword = $registerConfirmPassword.val();

                const $registerEmail = $('#register-email');
                const $formRegisterEmail = $('#form-register-email');
                const email = $registerEmail.val();

                const registerProfilePic = $('#register-profile-picture').val();

                let user;
                try {
                    user = new User(username, email, password, confirmPassword, registerProfilePic);
                } catch (error) {
                    toastr.error(error.message);

                    if (error.message.indexOf('Username') == 0) {
                        $formRegisterUsername.addClass('has-error');
                        $registerUsername.focus();
                        return;
                    } else {
                        $formRegisterUsername.removeClass('has-error').addClass('has-success');
                    }

                    if (error.message.indexOf('Password ') == 0) {
                        $formRegisterPassword.addClass('has-error');
                        $registerPassword.focus();
                        return;
                    } else {
                        $formRegisterPassword.removeClass('has-error').addClass('has-success');
                    }

                    if (error.message.indexOf('match') > -1) {
                        $formRegisterPassword.addClass('has-error');
                        $formRegisterConfirmPassword.addClass('has-error');
                        $registerConfirmPassword.focus();
                        return;
                    } else {
                        $formRegisterPassword.removeClass('has-error').addClass('has-success');
                        $formRegisterConfirmPassword.removeClass('has-error').addClass('has-success');
                    }

                    if (error.message.indexOf('E-Mail') > -1) {
                        $formRegisterEmail.addClass('has-error');
                        $registerEmail.focus();;
                        return;
                    } else {
                        $formRegisterEmail.removeClass('has-error').addClass('has-success');
                    }
                }

                $('.form-group').removeClass('has-error').addClass('has-success');
                $btnRegister.attr('disabled', true);

                authService.register(user.username, user.password, user.email, user.profilePicture)
                    .then(response => {
                        $registerPassword.val('');
                        $registerConfirmPassword.val('');

                        toastr.success(`User ${username} successfully registered!`);
                        localStorage.setItem('currentUser', JSON.stringify(response.user));
                        localStorage.setItem('token', response.token);

                        $(location).attr('href', '#!/home');
                        toggleButtonsIfLoggedIn();
                    })
                    .catch(error => {
                        if (error.status == 409) {
                            toastr.error('User with the same username already exists!');
                            $formRegisterUsername.addClass('has-error');
                            $registerUsername.focus();
                        } else {
                            toastr.error('An error occured! Please try again later!');
                            $btnRegister.removeClass('disabled');
                            console.log(error);
                        }

                        $btnRegister.attr('disabled', false);
                    });
            });
        });
}

function updateProfile(params) {
    let id = params.id;
    let data = {};
    let operatingUser = JSON.parse(localStorage.getItem('currentUser'));

    authService.getById(id)
        .catch(error => {
            if (error.status == 404) {
                compile('errors/not-found')
                    .then(html => $mainContainer.html(html));
            } else if (error.status == 500) {
                compile('errors/server-error')
                    .then(html => $mainContainer.html(html));
            }
        })
        .then(user => {
            data.user = user;
            data.operatingUser = operatingUser;
            return compile('auth/edit-profile', data);
        })
        .then(html => $mainContainer.html(html))
        .then(() => {
            _bindUpdateUserInfoButton(id, data, operatingUser);
            _bindBlockUserButton(data);
            _bindUnblockUserButton(data);
        });
}

function _bindUpdateUserInfoButton(id, data, operatingUser) {
    $(() => {
        let selectOption = data.user.admin || false;
        $(`option[value='${selectOption}']`).attr('selected', 'selected');
    });

    let $btnEditUserInfo = $('#btn-edit-profile');
    $btnEditUserInfo.on('click', () => {
        let $editUsername = $('#edit-username');
        let $formEditUsername = $('#form-edit-username');
        let username = $editUsername.val();

        let $editEmail = $('#edit-email');
        let $formEditEmail = $('#form-edit-email');
        let email = $editEmail.val();

        let isAdmin = $('#edit-admin-status').val() == 'true' ? true : false;
        let profilePicture = $('#edit-profile-picture').val();

        let user;
        try {
            user = new User(username, email, 'passss', 'passss', profilePicture);
        } catch (error) {
            toastr.error(error.message);

            if (error.message.indexOf('Username') == 0) {
                $formEditUsername.addClass('has-error');
                $editUsername.focus();
                toastr.error(error.message);
                return;
            } else {
                $formEditUsername.removeClass('has-error').addClass('has-success');
            }

            if (error.message.indexOf('E-Mail') > -1) {
                $formEditEmail.addClass('has-error');
                $editEmail.focus();
                toastr.error(error.message);
                return;
            } else {
                $formEditEmail.removeClass('has-error').addClass('has-success');
            }
        }

        $btnEditUserInfo.attr('disabled', true);

        authService.updateUserInfo(id, user.username, user.profilePicture, user.email, isAdmin)
            .then(response => {
                if (operatingUser._id == data.user._id) {
                    localStorage.setItem('currentUser', JSON.stringify(response));
                }

                toastr.success('User info updated!');
                $(location).attr('href', `#!/profile/${username.trim()}`);
            })
            .catch(error => {
                console.log(error);
                $btnEditUserInfo.attr('disabled', false);
                toastr.error('Username already taken!');
            });
    });
}

function _bindBlockUserButton(data) {
    console.log(data);
    let $btnBlockUser = $('#btn-block-user');
    $btnBlockUser.on('click', () => {
        $btnBlockUser.attr('disabled', true);

        authService.blockUser(data.user._id)
            .then(response => {
                console.log(response);
                toastr.success('User blocked!');
            })
            .catch(error => {
                console.log(error);
                toastr.error('An error occured!');
                $btnBlockUser.attr('disabled', false);
            });
    });
}

function _bindUnblockUserButton(data) {
    let $btnUnblockUser = $('#btn-unblock-user');
    $btnUnblockUser.on('click', () => {
        $btnUnblockUser.attr('disabled', true);

        authService.unblockUser(data.user._id)
            .then(response => {
                console.log(response);
                toastr.success('User blocked!');
            })
            .catch(error => {
                console.log(error);
                toastr.error('An error occured!');
                $btnUnblockUser.attr('disabled', false);
            });
    });
}

function changePassword() {
    if (!isLoggedIn()) {
        toastr.error('You are not authorized to do that!');
        $(location).attr('href', '#!/home');
        return;
    }

    let user = JSON.parse(localStorage.getItem('currentUser'));

    compile('auth/change-password')
        .then(html => $mainContainer.html(html))
        .then(() => {
            const $btnChangePassword = $('#btn-change-password'),
                $oldPassword = $('#old-password'),
                $newPassword = $('#new-password'),
                $confirmNewPassword = $('#confirm-new-password'),
                $formNewPassword = $('#form-new-password'),
                $formConfirmNewPassword = $('#form-confirm-new-password');

            $btnChangePassword.on('click', () => {
                if (!$newPassword.val() || $newPassword.val().trim().length < 6 || $newPassword.val().trim().length > 15) {
                    $formNewPassword.addClass('has-error');
                    $newPassword.focus();
                    toastr.error('Pasword length should be between 6 and 15 symbols!');
                    return;
                } else {
                    $formNewPassword.removeClass('has-error').addClass('has-success');
                }

                if (!$confirmNewPassword.val() || $newPassword.val().trim() != $confirmNewPassword.val().trim()) {
                    $formNewPassword.addClass('has-error');
                    $formConfirmNewPassword.addClass('has-error');
                    $confirmNewPassword.focus();
                    toastr.error('Paswords don\'t match!');
                    return;
                } else {
                    $formNewPassword.removeClass('has-error').addClass('has-success');
                    $formConfirmNewPassword.removeClass('has-error').addClass('has-success');
                }

                $btnChangePassword.attr('disabled', true);

                authService.changePassword(user._id, $oldPassword.val(), $newPassword.val())
                    .then(() => {
                        toastr.success('Password successfully changed!');
                        $(location).attr('href', '#!/profile');
                    })
                    .catch(error => {
                        if (error.status == 400) {
                            toastr.error('Invalid old password!');
                            $btnChangePassword.attr('disabled', false);
                            return;
                        }
                        console.log(error);
                        toastr.error('An error occured!');
                        $btnChangePassword.attr('disabled', false);
                    });
            });
        });
}

function previewProfile(params) {
    let username = params.username;

    authService.getByUsername(username)
        .then(user => {
            return compile('auth/preview-profile', user);
        })
        .then(html => $mainContainer.html(html))
        .catch(error => {
            if (error.status == 404) {
                compile('errors/not-found')
                    .then(html => $mainContainer.html(html));
            } else if (error.status == 500) {
                compile('errors/server-error')
                    .then(html => $mainContainer.html(html));
            }
        });
}

export {
    register,
    login,
    logout,
    profile,
    previewProfile,
    updateProfile,
    changePassword
};