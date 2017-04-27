import { compile } from 'templates-compiler';
import * as authService from 'auth-service';
import * as toastr from 'toastr';
import $ from 'jquery';
import { toggleButtonsIfLoggedIn } from 'utils';

const $mainContainer = $('#main-container');

function validateEmail(email) {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
}

function isLoggedIn() {
    return !!localStorage.getItem('currentUser');
}

function login() {
    if (isLoggedIn()) {
        toastr.error('You are already logged in!');
        return;
    }

    compile('login')
        .then(html => $mainContainer.html(html))
        .then(() => {
            let $btnLogin = $('#btn-login');
            $btnLogin.on('click', () => {
                $btnLogin.addClass('disabled');
                $btnLogin.attr('disabled', true);

                let $loginUsername = $('#login-username');
                let $formLoginUsername = $('#form-login-username');
                let username = $loginUsername.val();
                if (!username) {
                    $formLoginUsername.addClass('has-error');
                    $loginUsername.focus();
                    toastr.error('Username required!');
                    $btnLogin.removeClass('disabled');
                    $btnLogin.attr('disabled', false);
                    return;
                } else {
                    $formLoginUsername.removeClass('has-error').addClass('has-success');
                }

                let $loginPassword = $('#login-password');
                let $formLoginPassword = $('#form-login-password');
                let password = $loginPassword.val();
                if (!password) {
                    $formLoginPassword.addClass('has-error');
                    $loginPassword.focus();
                    toastr.error('Provide your password!');
                    $btnLogin.removeClass('disabled');
                    $btnLogin.attr('disabled', false);
                    return;
                } else {
                    $formLoginPassword.removeClass('has-error').addClass('has-success');
                }

                let user = {
                    username,
                    password
                };

                authService.login(user)
                    .then(response => {
                        localStorage.setItem('currentUser', JSON.stringify(response.user));
                        localStorage.setItem('token', response.token);
                        toastr.success('Login successful!');
                        $(location).attr('href', '#/home');
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

                        $btnLogin.removeClass('disabled');
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
    $(location).attr('href', '#/home');
    toastr.success('Successfully logged out!');
}

function profile() {
    let user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        compile('my-profile', user)
            .then(html => $mainContainer.html(html));
    } else {
        $(location).attr('href', '#/login');
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
            let $btnRegister = $('#btn-register');
            $btnRegister.on('click', () => {
                $btnRegister.addClass('disabled');
                $btnRegister.attr('disabled', true);

                let $registerUsername = $('#register-username');
                let $formRegisterUsername = $('#form-register-username');
                let username = $registerUsername.val();
                if (!username || username.trim().length < 6 || username.trim().length > 15) {
                    $formRegisterUsername.addClass('has-error');
                    $registerUsername.focus();
                    $btnRegister.removeClass('disabled');
                    $btnRegister.attr('disabled', false);
                    toastr.error('Username length should be between 6 and 15 symbols!');
                    return;
                } else {
                    $formRegisterUsername.removeClass('has-error').addClass('has-success');
                }

                let $registerPassword = $('#register-password');
                let $formRegisterPassword = $('#form-register-password');
                let password = $registerPassword.val();
                if (!password || password.trim().length < 6 || password.trim().length > 15) {
                    $formRegisterPassword.addClass('has-error');
                    $registerPassword.focus();
                    toastr.error('Pasword length should be between 6 and 15 symbols!');
                    $btnRegister.removeClass('disabled');
                    $btnRegister.attr('disabled', false);
                    return;
                } else {
                    $formRegisterPassword.removeClass('has-error').addClass('has-success');
                }

                let $registerConfirmPassword = $('#register-confirm-password');
                let $formRegisterConfirmPassword = $('#form-register-confirm-password');
                let confirmPassword = $registerConfirmPassword.val();
                if (password !== confirmPassword) {
                    $formRegisterPassword.addClass('has-error');
                    $formRegisterConfirmPassword.addClass('has-error');
                    $registerConfirmPassword.focus();
                    $btnRegister.removeClass('disabled');
                    $btnRegister.attr('disabled', false);
                    toastr.error('Paswords do not match!');
                    return;
                } else {
                    $formRegisterPassword.removeClass('has-error').addClass('has-success');
                    $formRegisterConfirmPassword.removeClass('has-error').addClass('has-success');
                }

                let $registerName = $('#register-name');
                let $formRegisterName = $('#form-register-name');
                let name = $registerName.val();
                if (!name || name.trim().length < 3 || name.trim().length > 25) {
                    $formRegisterName.addClass('has-error');
                    $registerName.focus();
                    toastr.error('Name length should be between 3 and 25 symbols!');
                    $btnRegister.removeClass('disabled');
                    $btnRegister.attr('disabled', false);
                    return;
                } else {
                    $formRegisterName.removeClass('has-error').addClass('has-success');
                }

                let $registerEmail = $('#register-email');
                let $formRegisterEmail = $('#form-register-email');
                let email = $registerEmail.val();
                if (!email || !validateEmail(email)) {
                    $formRegisterEmail.addClass('has-error');
                    $registerEmail.focus();
                    toastr.error('Please enter a valid E-Mail address!');
                    $btnRegister.removeClass('disabled');
                    $btnRegister.attr('disabled', false);
                    return;
                } else {
                    $formRegisterEmail.removeClass('has-error').addClass('has-success');
                }

                let $registerProfilePic = $('#register-profile-picture');

                let user = {
                    username,
                    password,
                    name,
                    email,
                    profilePicture: $registerProfilePic.val()
                };

                authService.register(user)
                    .then(response => {
                        $registerUsername.val('');
                        $registerPassword.val('');
                        $registerConfirmPassword.val('');
                        $registerName.val('');
                        $registerEmail.val('');
                        $registerProfilePic.val('');

                        toastr.success(`User ${username} successfully registered!`);
                        localStorage.setItem('currentUser', JSON.stringify(response.user));
                        localStorage.setItem('token', response.token);
                        $(location).attr('href', '#/home');
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

                        $btnRegister.removeClass('disabled');
                        $btnRegister.attr('disabled', false);
                    });
            });
        });
}

export { register, login, logout, profile };