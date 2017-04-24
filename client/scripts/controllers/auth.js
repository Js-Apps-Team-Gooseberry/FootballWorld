import { compile } from 'templates-compiler';
import * as authService from 'auth-service';
import * as toastr from 'toastr';
import $ from 'jquery';
import { checkIfLoggedIn } from 'utils';

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
            $('#btn-login').on('click', () => {
                $('#btn-login').addClass('disabled');
                $('#btn-login').attr('disabled', true);

                let username = $('#login-username').val();
                if (!username) {
                    $('#form-login-username').addClass('has-error');
                    $('#login-username').focus();
                    toastr.error('Username required!');
                    $('#btn-login').removeClass('disabled');
                    $('#btn-login').attr('disabled', false);
                    return;
                } else {
                    $('#form-login-username').removeClass('has-error').addClass('has-success');
                }

                let password = $('#login-password').val();
                if (!password) {
                    $('#form-login-password').addClass('has-error');
                    $('#login-password').focus();
                    toastr.error('Provide your password!');
                    $('#btn-login').removeClass('disabled');
                    $('#btn-login').attr('disabled', false);
                    return;
                } else {
                    $('#form-login-password').removeClass('has-error').addClass('has-success');
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
                        checkIfLoggedIn();
                    })
                    .catch(error => {
                        if (error.status == 401) {
                            toastr.error('Invalid username or/and password!');
                            $('#form-login-username').addClass('has-error');
                            $('#form-login-password').addClass('has-error');
                        } else if (error.status == 403) {
                            toastr.error('Account blocked!');
                        } else {
                            toastr.error('An error occured! Please try again later!');
                            console.log(error);
                        }

                        $('#btn-login').removeClass('disabled');
                        $('#btn-login').attr('disabled', false);
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
    checkIfLoggedIn();
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
            $('#btn-register').on('click', () => {
                $('#btn-register').addClass('disabled');
                $('#btn-register').attr('disabled', true);

                let username = $('#register-username').val();
                if (!username || username.trim().length < 6 || username.trim().length > 15) {
                    $('#form-register-username').addClass('has-error');
                    $('#register-username').focus();
                    $('#btn-register').removeClass('disabled');
                    $('#btn-register').attr('disabled', false);
                    toastr.error('Username length should be between 6 and 15 symbols!');
                    return;
                } else {
                    $('#form-register-username').removeClass('has-error').addClass('has-success');
                }

                let password = $('#register-password').val();
                if (!password || password.trim().length < 6 || password.trim().length > 15) {
                    $('#form-register-password').addClass('has-error');
                    $('#register-password').focus();
                    toastr.error('Pasword length should be between 6 and 15 symbols!');
                    $('#btn-register').removeClass('disabled');
                    $('#btn-register').attr('disabled', false);
                    return;
                } else {
                    $('#form-register-password').removeClass('has-error').addClass('has-success');
                }

                let confirmPassword = $('#register-confirm-password').val();
                if (password !== confirmPassword) {
                    $('#form-register-password').addClass('has-error');
                    $('#form-register-confirm-password').addClass('has-error');
                    $('#register-confirm-password').focus();
                    $('#btn-register').removeClass('disabled');
                    $('#btn-register').attr('disabled', false);
                    toastr.error('Paswords do not match!');
                    return;
                } else {
                    $('#form-register-password').removeClass('has-error').addClass('has-success');
                    $('#form-register-confirm-password').removeClass('has-error').addClass('has-success');
                }

                let name = $('#register-name').val();
                if (!name || name.trim().length < 3 || name.trim().length > 25) {
                    $('#form-register-name').addClass('has-error');
                    $('#register-name').focus();
                    toastr.error('Name length should be between 3 and 25 symbols!');
                    $('#btn-register').removeClass('disabled');
                    $('#btn-register').attr('disabled', false);
                    return;
                } else {
                    $('#form-register-name').removeClass('has-error').addClass('has-success');
                }

                let email = $('#register-email').val();
                if (!email || !validateEmail(email)) {
                    $('#form-register-email').addClass('has-error');
                    $('#register-email').focus();
                    toastr.error('Please enter a valid E-Mail address!');
                    $('#btn-register').removeClass('disabled');
                    $('#btn-register').attr('disabled', false);
                    return;
                } else {
                    $('#form-register-email').removeClass('has-error').addClass('has-success');
                }

                let user = {
                    username,
                    password,
                    name,
                    email,
                    profilePicture: $('#register-profile-picture').val()
                };

                authService.register(user)
                    .then(response => {
                        $('#register-username').val('');
                        $('#register-password').val('');
                        $('#register-confirm-password').val('');
                        $('#register-name').val('');
                        $('#register-email').val('');
                        $('#register-profile-picture').val('');

                        toastr.success(`User ${username} successfully registered!`);
                        localStorage.setItem('currentUser', JSON.stringify(response.user));
                        localStorage.setItem('token', response.token);
                        $(location).attr('href', '#/home');
                        checkIfLoggedIn();
                    })
                    .catch(error => {
                        if (error.status == 409) {
                            toastr.error('User with the same username already exists!');
                            $('#form-register-username').addClass('has-error');
                            $('#register-username').focus();
                        } else {
                            toastr.error('An error occured! Please try again later!');
                            $('#btn-register').removeClass('disabled');
                            console.log(error);
                        }

                        $('#btn-register').removeClass('disabled');
                        $('#btn-register').attr('disabled', false);
                    });
            });
        });
}

export { register, login, logout, profile };