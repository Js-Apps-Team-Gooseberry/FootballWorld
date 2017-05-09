/* globals chai describe it beforeEach afterEach */

import { isLoggedIn, isAdmin, isAuthorized, toggleButtonsIfLoggedIn } from 'utils';
import $ from 'jquery';
const { assert } = chai;

describe('Auth utils tests', () => {
    const regularUser = JSON.stringify({});
    const admin = JSON.stringify({ admin: true });
    const currentUser = 'currentUser';

    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });


    describe('isLoggedIn should', () => {
        it('return true when there is a currentUser item in localStorage', () => {
            localStorage.setItem(currentUser, 'some-user');
            assert.isTrue(isLoggedIn());
        });

        it('return false when there is no item in localStorage', () => {
            localStorage.clear();
            assert.isFalse(isLoggedIn());
        });
    });

    describe('isAdmin should', () => {
        it('return false when there is no item in localStorage', () => {
            localStorage.clear();
            assert.isFalse(isAdmin());
        });

        it('return false when user is specified as regular', () => {
            localStorage.setItem(currentUser, regularUser);
            assert.isFalse(isAdmin());
        });

        it('return true when user is admin', () => {
            localStorage.setItem(currentUser, admin);
            assert.isTrue(isAdmin());
        });
    });

    describe('isAuthorized should', () => {
        const targetId = 1;

        it('return false when there is no item in localStorage', () => {
            localStorage.clear();
            assert.isFalse(isAuthorized(targetId));
        });

        it('return false when user is specified as regular and not author of the target content', () => {
            const user = JSON.stringify({
                _id: 112
            });

            localStorage.setItem(currentUser, user);
            assert.isFalse(isAuthorized(targetId));
        });

        it('return true when user is admin', () => {
            localStorage.setItem(currentUser, admin);
            assert.isTrue(isAuthorized(targetId));
        });

        it('return true when user is author of the target content', () => {
            const user = JSON.stringify({
                _id: 1
            });

            localStorage.setItem(currentUser, user);
            assert.isTrue(isAuthorized(targetId));
        });
    });

    describe('toggleButtonsIfLoggedIn should', () => {
        $('body').append('<div class="hidden logged-in"></div>');
        $('body').append('<div class="hidden logged-out"></div>');
        $('body').append('<div class="hidden admin"></div>');

        beforeEach(() => {
            $('.logged-in').addClass('hidden');
            $('.logged-out').addClass('hidden');
            $('.admin').addClass('hidden');
        });

        it('set logged-in elements as visible when user is logged in', () => {
            localStorage.clear();
            localStorage.setItem(currentUser, regularUser);
            toggleButtonsIfLoggedIn();
            let result = $('.logged-in').first().hasClass('hidden');
            assert.isFalse(result);
        });

        it('set logged-out elements as hidden when user is logged in', () => {
            localStorage.clear();
            localStorage.setItem(currentUser, regularUser);
            toggleButtonsIfLoggedIn();
            let result = $('.logged-out').first().hasClass('hidden');
            assert.isTrue(result);
        });

        it('set logged-in elements as hidden when there is no user', () => {
            localStorage.clear();
            toggleButtonsIfLoggedIn();
            let result = $('.logged-out').first().hasClass('hidden');
            assert.isFalse(result);
        });

        it('set logged-in elements as hidden when there is no user', () => {
            localStorage.clear();
            toggleButtonsIfLoggedIn();
            let result = $('.logged-in').first().hasClass('hidden');
            assert.isTrue(result);
        });

        it('set admin elements as hidden when there is no user', () => {
            localStorage.clear();
            toggleButtonsIfLoggedIn();
            let result = $('.admin').first().hasClass('hidden');
            assert.isTrue(result);
        });

        it('set admin elements as hidden when there is a user but not an admin', () => {
            localStorage.clear();
            localStorage.setItem(currentUser, regularUser);
            toggleButtonsIfLoggedIn();
            let result = $('.admin').first().hasClass('hidden');
            assert.isTrue(result);
        });

        it('set admin elements as visible when there is an admin', () => {
            localStorage.clear();
            localStorage.setItem(currentUser, admin);
            toggleButtonsIfLoggedIn();
            let result = $('.admin').first().hasClass('hidden');
            assert.isFalse(result);
        });
    });
});