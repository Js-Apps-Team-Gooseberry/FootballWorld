import * as utils from 'utils';

const minLengthTitle = 5;
const maxLengthTitle = 100;
const minLengthDescription = 20;
const maxLengthDescription = 1000;
const minLengthContent = 5;
const maxLengthContent = 5000;

class NewsEntry {
    constructor(title, imageUrl, tags, description, content) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.tags = tags;
        this.description = description;
        this.content = content;
    }

    get title() {
        return this._title;
    }

    set title(value) {
        utils.validateStringLength(value, minLengthTitle, maxLengthTitle, 'Title');
        this._title = value.trim();
    }

    get imageUrl() {
        return this._imageUrl;
    }

    set imageUrl(value) {
        utils.isUrlValid(value);
        this._imageUrl = value.trim();
    }

    get tags() {
        return this._tags;
    }

    set tags(value) {
        this._tags = value.trim();
    }

    get description() {
        return this._description;
    }

    set description(value) {
        utils.validateStringLength(value, minLengthDescription, maxLengthDescription, 'Description');
        this._description = value.trim();
    }

    get content() {
        return this._content;
    }

    set content(value) {
        utils.validateStringLength(value, minLengthContent, maxLengthContent, 'Content');
        this._content = value.trim();
    }
}

export { NewsEntry };
