import { validateStringLength, validateEmail } from 'utils';

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
        validateStringLength(value, 5, 15, 'Username');
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
        validateEmail(value);
        this._email = value.trim();
    }

    get password() {
        return this._password;
    }

    set password(value) {
        validateStringLength(value, 6, 15, 'Password');
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