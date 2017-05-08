/* globals describe it chai sinon beforeEach afterEach */

import * as utils from 'utils';
import { User } from 'user-model';

const { expect } = chai;

describe('User model tests', () => {
    describe('constructor should', () => {
        let validateLengthStub;
        let validateEmailStub;

        beforeEach(() => {
            validateLengthStub = sinon.stub(utils, 'validateStringLength').returns({});
            validateEmailStub = sinon.stub(utils, 'validateEmail').returns({});
        });

        afterEach(() => {
            validateLengthStub.restore();
            validateEmailStub.restore();
        });

        it('assign values correctly', () => {
            const user = {
                _username: 'username',
                _email: 'email',
                _password: 'password',
                _confirmPassword: 'password',
                _profilePicture: 'profilePicture'
            };

            const validUser = new User(user._username, user._email, user._password, user._confirmPassword, user._profilePicture);

            expect(validUser).to.be.deep.equal(user);
        });

        it('call length validator on setting username', () => {
            const user = {
                _username: 'username',
                _email: 'email',
                _password: 'password',
                _confirmPassword: 'password',
                _profilePicture: 'profilePicture'
            };

            new User(user._username, user._email, user._password, user._confirmPassword, user._profilePicture);

            expect(validateLengthStub).to.be.calledWith(user._username);
        });


        it('call length validator on setting password', () => {
            const user = {
                _username: 'username',
                _email: 'email',
                _password: 'password',
                _confirmPassword: 'password',
                _profilePicture: 'profilePicture'
            };

            new User(user._username, user._email, user._password, user._confirmPassword, user._profilePicture);

            expect(validateLengthStub).to.be.calledWith(user._password);
        });

        it('call email validator on setting email', () => {
            const user = {
                _username: 'username',
                _email: 'email',
                _password: 'password',
                _confirmPassword: 'password',
                _profilePicture: 'profilePicture'
            };

            new User(user._username, user._email, user._password, user._confirmPassword, user._profilePicture);

            expect(validateEmailStub).to.be.calledWith(user._email);
        });
    });
});
