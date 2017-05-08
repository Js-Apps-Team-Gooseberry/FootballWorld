import * as utils from 'utils';

const minLengthUsername = 5;
const maxLengthUsername = 15;
const minLengthPassword = 6;
const maxLengthPassword = 15;

class User {
    constructor(username, email, password, confirmPassword, profilePicture) {
        this.username = username;
        this.password = password;
        this.confirmPassword = confirmPassword;
        this.email = email;
        this.profilePicture = profilePicture;
    }

    get username() {
        return this._username;
    }

    set username(value) {
        utils.validateStringLength(value, minLengthUsername, maxLengthUsername, 'Username');
        this._username = value.trim();
    }

    get profilePicture() {
        return this._profilePicture;
    }

    set profilePicture(value) {
        value = value || '';
        this._profilePicture = value.trim();
    }

    get email() {
        return this._email;
    }

    set email(value) {
        utils.validateEmail(value);
        this._email = value.trim();
    }

    get password() {
        return this._password;
    }

    set password(value) {
        utils.validateStringLength(value, minLengthPassword, maxLengthPassword, 'Password');
        this._password = value.trim();
    }

    get confirmPassword() {
        return this._confirmPassword;
    }

    set confirmPassword(value) {
        if (!value || this.password.trim() != value.trim()) {
            throw new Error('Passwords do not match!');
        }

        this._confirmPassword = value.trim();
    }
}

export { User };