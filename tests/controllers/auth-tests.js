/* globals describe it chai sinon beforeEach afterEach */

import * as authController from 'auth-controller';
import * as toastr from 'toastr';
import * as utils from 'utils';
import * as loader from 'templates-compiler';

const { expect } = chai;

describe('Auth controller tests', () => {
    describe('login should', () => {
        let isLoggedInStub;
        let toastrStubError;
        let compileStub;
        let changeHtmlStub;

        beforeEach(() => {
            isLoggedInStub = sinon.stub(utils, 'isLoggedIn');
            isLoggedInStub.returns(false);

            toastrStubError = sinon.stub(toastr, 'error');
            toastrStubError.returns({});

            compileStub = sinon.stub(loader, 'compile');
            compileStub.returns(Promise.resolve());

            changeHtmlStub = sinon.stub(utils, 'changeMainContainerHtml');
            changeHtmlStub.returns({});
        });

        afterEach(() => {
            isLoggedInStub.restore();
            toastrStubError.restore();
            compileStub.restore();
            changeHtmlStub.restore();
        });

        it('display error message when user is already logged in', () => {
            isLoggedInStub.returns(true);
            authController.login();
            expect(toastrStubError).to.have.been.calledWith('You are already logged in!');
        });

        it('make a call to compiler with correct args', () => {
            authController.login();
            expect(compileStub).to.be.calledWith('auth/login');
        });
    });

    describe('Logout should', () => {
        const currentUser = 'currentUser';
        const token = 'token';

        let isLoggedInStub;
        let toastrErrorStub;
        let toastrSuccessStub;
        let toggleLoginButtonsStub;

        beforeEach(() => {
            localStorage.clear();
            isLoggedInStub = sinon.stub(utils, 'isLoggedIn').returns(true);
            toastrErrorStub = sinon.stub(toastr, 'error').returns({});
            toastrSuccessStub = sinon.stub(toastr, 'success').returns({});
            toggleLoginButtonsStub = sinon.stub(utils, 'toggleButtonsIfLoggedIn').returns({});
        });

        afterEach(() => {
            localStorage.clear();
            isLoggedInStub.restore();
            toastrErrorStub.restore();
            toastrSuccessStub.restore();
            toggleLoginButtonsStub.restore();
        });

        it('display error message if user is not logged in', () => {
            isLoggedInStub.returns(false);
            authController.logout();
            expect(toastrErrorStub).to.be.calledWith('You are not logged in!');
        });

        it('remove user from localStorage', () => {
            localStorage.setItem(currentUser, 'some-user');
            authController.logout();
            expect(localStorage.getItem(currentUser)).to.be.null;
        });

        it('remove token from localStorage', () => {
            localStorage.setItem(token, 'some-encrypted-token-like-that-askdjasdaskldj;klasjdkasjd2uwed2309');
            authController.logout();
            expect(localStorage.getItem(token)).to.be.null;
        });

        it('call toggleLoginButtons', () => {
            authController.logout();
            expect(toggleLoginButtonsStub).to.be.calledOnce;
        });

        it('display success message with correct args', () => {
            authController.logout();
            expect(toastrSuccessStub).to.be.calledWith('Successfully logged out!');
        });
    });

    describe('profile should', () => {
        let loaderStub;
        let toastrErrorStub;

        beforeEach(() => {
            localStorage.clear();
            toastrErrorStub = sinon.stub(toastr, 'error').returns({});
            loaderStub = sinon.stub(loader, 'compile').returns(Promise.resolve());
        });

        afterEach(() => {
            localStorage.clear();
            toastrErrorStub.restore();
            loaderStub.restore();
        });

        it('display error message if localStorage is cleared', () => {
            authController.profile();
            expect(toastrErrorStub).to.be.calledWith('You need to be logged in to view this page!');
        });

        it('call compiler when there is a user object in localStorage', () => {
            localStorage.setItem('currentUser', '{"user":"some-user"}');
            authController.profile();
            expect(loaderStub).to.be.calledWith('auth/my-profile');
        });
    });
});
