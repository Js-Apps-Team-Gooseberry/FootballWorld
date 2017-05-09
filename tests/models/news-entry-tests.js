/* globals describe it chai sinon beforeEach afterEach */

import * as utils from 'utils';
import { NewsEntry } from 'news-entry-model';

const { expect } = chai;

describe('News entry model tests', () => {
    describe('constructor should', () => {
        let validateLengthStub;
        let isUrlValidStub;

        beforeEach(() => {
            validateLengthStub = sinon.stub(utils, 'validateStringLength').returns({});
            isUrlValidStub = sinon.stub(utils, 'isUrlValid').returns({});
        });

        afterEach(() => {
            validateLengthStub.restore();
            isUrlValidStub.restore();
        });

        it('assign values correctly', () => {
            const newsEntry = {
                _title: 'inspirational-stuff',
                _tags: 'tags',
                _imageUrl: 'http://somethewkjassdadas.as',
                _description: 'descriptiondescriptiondescription',
                _content: 'content'
            };

            const validNewsEntry = new NewsEntry(newsEntry._title, newsEntry._imageUrl, newsEntry._tags, newsEntry._description, newsEntry._content);

            expect(validNewsEntry).to.be.deep.equal(newsEntry);
        });

        it('call length validator on setting title', () => {
            const newsEntry = {
                _title: 'inspirational-stuff',
                _tags: 'tags',
                _imageUrl: 'http://somethewkjassdadas.as',
                _description: 'descriptiondescriptiondescription',
                _content: 'content'
            };

            new NewsEntry(newsEntry._title, newsEntry._imageUrl, newsEntry._tags, newsEntry._description, newsEntry._content);

            expect(validateLengthStub).to.be.calledWith(newsEntry._title);
        });

        it('call length validator on setting description', () => {
            const newsEntry = {
                _title: 'inspirational-stuff',
                _tags: 'tags',
                _imageUrl: 'http://somethewkjassdadas.as',
                _description: 'descriptiondescriptiondescription',
                _content: 'content'
            };

            new NewsEntry(newsEntry._title, newsEntry._imageUrl, newsEntry._tags, newsEntry._description, newsEntry._content);

            expect(validateLengthStub).to.be.calledWith(newsEntry._description);
        });

        it('call length validator on setting content', () => {
            const newsEntry = {
                _title: 'inspirational-stuff',
                _tags: 'tags',
                _imageUrl: 'http://somethewkjassdadas.as',
                _description: 'descriptiondescriptiondescription',
                _content: 'content'
            };

            new NewsEntry(newsEntry._title, newsEntry._imageUrl, newsEntry._tags, newsEntry._description, newsEntry._content);

            expect(validateLengthStub).to.be.calledWith(newsEntry._content);
        });

        it('call url validator on setting imageUrl', () => {
            const newsEntry = {
                _title: 'inspirational-stuff',
                _tags: 'tags',
                _imageUrl: 'http://somethewkjassdadas.as',
                _description: 'descriptiondescriptiondescription',
                _content: 'content'
            };

            new NewsEntry(newsEntry._title, newsEntry._imageUrl, newsEntry._tags, newsEntry._description, newsEntry._content);

            expect(isUrlValidStub).to.be.calledWith(newsEntry._imageUrl);
        });
    });
});
