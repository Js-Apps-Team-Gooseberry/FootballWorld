/* globals describe it chai sinon beforeEach afterEach */

import * as authService from 'auth-service';
import * as requester from 'requester';

const { expect } = chai;

describe('Auth service tests', () => {
    describe('register should', () => {
        const username = 'some-username';
        const password = 'some-pass';
        const email = 'email';
        const profilePicture = 'profPic';

        let postRequestStub;

        beforeEach(() => {
            postRequestStub = sinon.stub(requester, 'postJSON');
            postRequestStub.returns(Promise.resolve());
        });

        afterEach(() => {
            postRequestStub.restore();
        });

        it('make a POST request', (done) => {
            authService.register(username, password, email, profilePicture)
                .then(() => {
                    expect(postRequestStub).to.have.been.calledOnce;
                })
                .then(done, done);
        });

        it('make a POST request to correct url', (done) => {
            authService.register(username, password, email, profilePicture)
                .then(() => {
                    expect(postRequestStub).to.have.been.calledWith('/api/auth/register');
                })
                .then(done, done);
        });

        it('make a POST request with correct params', (done) => {
            authService.register(username, password, email, profilePicture)
                .then(() => {
                    let body = {
                        username,
                        password,
                        email,
                        profilePicture
                    };

                    expect(postRequestStub.args[0][1]).to.be.deep.equal(body);
                })
                .then(done, done);
        });

        it('make request with body with correct properties', (done) => {
            authService.register(username, password, email, profilePicture)
                .then(() => {
                    expect(postRequestStub.args[0][1]).to.include.keys('username', 'email', 'password', 'profilePicture');
                })
                .then(done, done);
        });

        it('return correct result', (done) => {
            const expected = {
                username
            };

            postRequestStub.returns(Promise.resolve(expected));

            authService.register(username, password, email, profilePicture)
                .then(response => {
                    expect(response).to.deep.equal(expected);
                })
                .then(done, done);
        });
    });

    describe('login should', () => {
        const username = 'username';
        const password = 'password';

        let putRequestStub;

        beforeEach(() => {
            putRequestStub = sinon.stub(requester, 'putJSON');
            putRequestStub.returns(Promise.resolve());
        });

        afterEach(() => {
            putRequestStub.restore();
        });

        it('make PUT request', (done) => {
            authService.login(username, password)
                .then(() => {
                    expect(putRequestStub).to.have.been.calledOnce;
                })
                .then(done, done);
        });

        it('make PUT request to correct url', (done) => {
            authService.login(username, password)
                .then(() => {
                    expect(putRequestStub).to.have.been.calledWith('/api/auth/login');
                })
                .then(done, done);
        });

        it('make PUT request with correct params', (done) => {
            let body = {
                username,
                password
            };

            authService.login(username, password)
                .then(() => {
                    expect(putRequestStub.args[0][1]).to.be.deep.equal(body);
                })
                .then(done, done);
        });

        it('make PUT request correct result', (done) => {
            let body = {
                username,
                password
            };

            putRequestStub.returns(Promise.resolve(body));

            authService.login(username, password)
                .then(result => {
                    expect(result).to.be.deep.equal(body);
                })
                .then(done, done);
        });

        it('make request with body with correct properties', (done) => {
            authService.login(username, password)
                .then(() => {
                    expect(putRequestStub.args[0][1]).to.include.keys('username', 'password');
                })
                .then(done, done);
        });
    });

    describe('getById should', () => {
        const id = 'id';
        let getRequestStub;

        beforeEach(() => {
            getRequestStub = sinon.stub(requester, 'getJSON');
            getRequestStub.returns(Promise.resolve());
        });

        afterEach(() => {
            getRequestStub.restore();
        });

        it('make GET request with correct url', (done) => {
            authService.getById(id)
                .then(() => {
                    expect(getRequestStub).to.be.calledWith(`/api/auth/get-by-id/${id}`);
                })
                .then(done, done);
        });

        it('return correct result', (done) => {
            let expected = { id };
            getRequestStub.returns(Promise.resolve(expected));

            authService.getById(id)
                .then(result => {
                    expect(result).to.be.deep.equal(expected);
                })
                .then(done, done);
        });
    });

    describe('updateUserInfo should', () => {
        const id = 'id';
        const username = 'some-username';
        const isAdmin = true;
        const email = 'email';
        const profilePicture = 'profPic';

        let putRequestStub;

        beforeEach(() => {
            putRequestStub = sinon.stub(requester, 'putJSON');
            putRequestStub.returns(Promise.resolve());
        });

        afterEach(() => {
            putRequestStub.restore();
        });

        it('make PUT request to correct url', (done) => {
            authService.updateUserInfo(id, username, isAdmin, email, profilePicture)
                .then(() => {
                    expect(putRequestStub).to.have.been.calledWith(`/api/auth/update-user-info/${id}`);
                })
                .then(done, done);
        });

        it('make PUT request with correct data', (done) => {
            let body = {
                username,
                profilePicture,
                email,
                isAdmin
            };

            authService.updateUserInfo(id, username, profilePicture, email, isAdmin)
                .then(() => {
                    expect(putRequestStub.args[0][1]).to.deep.equal(body);
                })
                .then(done, done);
        });

        it('make request with body with correct properties', (done) => {
            authService.updateUserInfo(id, username, profilePicture, email, isAdmin)
                .then(() => {
                    expect(putRequestStub.args[0][1]).to.include.keys('username', 'email', 'isAdmin', 'profilePicture');
                })
                .then(done, done);
        });

        it('return correct data', (done) => {
            let expected = {
                username,
                profilePicture,
                email,
                isAdmin
            };

            putRequestStub.returns(Promise.resolve(expected));

            authService.updateUserInfo(id, username, profilePicture, email, isAdmin)
                .then(result => {
                    expect(result).to.be.deep.equal(expected);
                })
                .then(done, done);
        });
    });

    describe('blockUser should', () => {
        const id = 'id';

        let putRequestStub;

        beforeEach(() => {
            putRequestStub = sinon.stub(requester, 'putJSON');
            putRequestStub.returns(Promise.resolve());
        });

        afterEach(() => {
            putRequestStub.restore();
        });

        it('make PUT request to correct url', (done) => {
            authService.blockUser(id)
                .then(() => {
                    expect(putRequestStub).to.have.calledWith(`/api/auth/block-user/${id}`);
                })
                .then(done, done);
        });

        it('return correct result', (done) => {
            const expected = {
                somethingExpected: 'not-at-all'
            };

            putRequestStub.returns(Promise.resolve(expected));

            authService.blockUser(id)
                .then(result => {
                    expect(result).to.be.deep.equal(expected);
                })
                .then(done, done);
        });
    });

    describe('unblockUser should', () => {
        const id = 'id';

        let putRequestStub;

        beforeEach(() => {
            putRequestStub = sinon.stub(requester, 'putJSON');
            putRequestStub.returns(Promise.resolve());
        });

        afterEach(() => {
            putRequestStub.restore();
        });

        it('make PUT request to correct url', (done) => {
            authService.unblockUser(id)
                .then(() => {
                    expect(putRequestStub).to.have.calledWith(`/api/auth/unblock-user/${id}`);
                })
                .then(done, done);
        });

        it('return correct result', (done) => {
            const expected = {
                somethingExpected: 'not-at-all'
            };

            putRequestStub.returns(Promise.resolve(expected));

            authService.unblockUser(id)
                .then(result => {
                    expect(result).to.be.deep.equal(expected);
                })
                .then(done, done);
        });
    });

    describe('changePassword should', () => {
        const id = 'id';
        const oldPassword = 'oldPassword';
        const newPassword = 'newPassword';

        let putRequestStub;

        beforeEach(() => {
            putRequestStub = sinon.stub(requester, 'putJSON');
            putRequestStub.returns(Promise.resolve());
        });

        afterEach(() => {
            putRequestStub.restore();
        });

        it('make PUT request to correct url', (done) => {
            authService.changePassword(id, oldPassword, newPassword)
                .then(() => {
                    expect(putRequestStub).to.have.calledWith(`/api/auth/change-password/${id}`);
                })
                .then(done, done);
        });

        it('make PUT request with correct data', (done) => {
            const body = {
                oldPassword,
                newPassword
            };

            authService.changePassword(id, oldPassword, newPassword)
                .then(() => {
                    expect(putRequestStub.args[0][1]).to.be.deep.equal(body);
                })
                .then(done, done);
        });

        it('make PUT request with body with correct properties', (done) => {
            authService.changePassword(id, oldPassword, newPassword)
                .then(() => {
                    expect(putRequestStub.args[0][1]).to.include.keys('oldPassword', 'newPassword');
                })
                .then(done, done);
        });

        it('return correct result', (done) => {
            const expected = {
                oldPassword,
                newPassword
            };

            putRequestStub.returns(Promise.resolve(expected));

            authService.changePassword(id, oldPassword, newPassword)
                .then(result => {
                    expect(result).to.be.deep.equal(expected);
                })
                .then(done, done);
        });
    });

    describe('getByUsername should', () => {
        const username = 'username';
        let getRequestStub;

        beforeEach(() => {
            getRequestStub = sinon.stub(requester, 'getJSON');
            getRequestStub.returns(Promise.resolve());
        });

        afterEach(() => {
            getRequestStub.restore();
        });

        it('should call GET request with correct url', (done) => {
            authService.getByUsername(username)
                .then(() => {
                    expect(getRequestStub).to.be.calledWith(`/api/auth/get-by-username/${username}`);
                })
                .then(done, done);
        });

        it('should return correct result', (done) => {
            let expected = { username };
            getRequestStub.returns(Promise.resolve(expected));

            authService.getByUsername(username)
                .then(result => {
                    expect(result).to.be.deep.equal(expected);
                })
                .then(done, done);
        });
    });
});
