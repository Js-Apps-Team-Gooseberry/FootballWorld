/* globals chai describe it beforeEach afterEach */

import { isLoggedIn, isAdmin, isAuthorized } from 'utils';
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
});