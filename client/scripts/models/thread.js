import * as utils from 'utils';

const minLengthTitle = 5;
const maxLengthTitle = 50;
const minLengthTags = 4;
const maxLengthTags = 30;
const minLengthContent = 5;
const maxLengthContent = 2000;
const categries = [
    'Website', 'Free Zone', 'Teams', 'Games', 'Media Watch'
];

class Thread {
    constructor(title, imageUrl, tags, category, content) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.tags = tags;
        this.category = category;
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
        utils.validateStringLength(value, minLengthTags, maxLengthTags, 'Tags');
        this._tags = value.trim();
    }

    get category() {
        return this._category;
    }

    set category(value) {
        if (!categries.includes(value.trim())) {
            throw new Error('Invalid category!');
        }
        
        this._category = value.trim();
    }

    get content() {
        return this._content;
    }

    set content(value) {
        utils.validateStringLength(value, minLengthContent, maxLengthContent, 'Content');
        this._content = value.trim();
    }
}

export { Thread };
