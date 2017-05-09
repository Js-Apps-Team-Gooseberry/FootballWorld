import * as utils from 'utils';

const minLengthContent = 3;
const maxLengthContent = 500;

class Comment {
    constructor(content) {
        this.content = content;
    }

    get content() {
        return this._content;
    }

    set content(value) {
        utils.validateStringLength(value, minLengthContent, maxLengthContent, 'Comment');
        this._content = value.trim();
    }
}

export { Comment };
