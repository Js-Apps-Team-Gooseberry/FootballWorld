/* globals describe it chai sinon beforeEach afterEach */

import * as utils from 'utils';
import { Thread } from 'thread-model';

const { expect } = chai;

describe('Thread model tests', () => {
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
            const thread = {
                _title: 'title',
                _imageUrl: 'imageaksdjaskdjasd',
                _tags: 'tagsasd',
                _category: 'Website',
                _content: 'content'
            };

            const validThread = new Thread(thread._title, thread._imageUrl, thread._tags, thread._category, thread._content);

            expect(validThread).to.be.deep.equal(thread);
        });

        it('make a call to validateLength for title', () => {
            const thread = {
                _title: 'title',
                _imageUrl: 'imageaksdjaskdjasd',
                _tags: 'tagsasd',
                _category: 'Website',
                _content: 'content'
            };

            new Thread(thread._title, thread._imageUrl, thread._tags, thread._category, thread._content);

            expect(validateLengthStub).to.be.calledWith(thread._title);
        });

        it('make a call to validateLength for tags', () => {
            const thread = {
                _title: 'title',
                _imageUrl: 'imageaksdjaskdjasd',
                _tags: 'tagsasd',
                _category: 'Website',
                _content: 'content'
            };

            new Thread(thread._title, thread._imageUrl, thread._tags, thread._category, thread._content);

            expect(validateLengthStub).to.be.calledWith(thread._tags);
        });

        it('make a call to validateLength for content', () => {
            const thread = {
                _title: 'title',
                _imageUrl: 'imageaksdjaskdjasd',
                _tags: 'tagsasd',
                _category: 'Website',
                _content: 'content'
            };

            new Thread(thread._title, thread._imageUrl, thread._tags, thread._category, thread._content);

            expect(validateLengthStub).to.be.calledWith(thread._content);
        });

        it('make a call to isUrlValid for imageUrl', () => {
            const thread = {
                _title: 'title',
                _imageUrl: 'imageaksdjaskdjasd',
                _tags: 'tagsasd',
                _category: 'Website',
                _content: 'content'
            };

            new Thread(thread._title, thread._imageUrl, thread._tags, thread._category, thread._content);

            expect(isUrlValidStub).to.be.calledWith(thread._imageUrl);
        });

        it('not throw when category is valid - Free Zone', () => {
            const thread = {
                _title: 'title',
                _imageUrl: 'imageaksdjaskdjasd',
                _tags: 'tagsasd',
                _category: 'Free Zone',
                _content: 'content'
            };

            expect(() => new Thread(thread._title, thread._imageUrl, thread._tags, thread._category, thread._content)).to.not.throw();
        });

        it('not throw when category is valid - Teams', () => {
            const thread = {
                _title: 'title',
                _imageUrl: 'imageaksdjaskdjasd',
                _tags: 'tagsasd',
                _category: 'Teams',
                _content: 'content'
            };

            expect(() => new Thread(thread._title, thread._imageUrl, thread._tags, thread._category, thread._content)).to.not.throw();
        });

        it('not throw when category is valid - Games', () => {
            const thread = {
                _title: 'title',
                _imageUrl: 'imageaksdjaskdjasd',
                _tags: 'tagsasd',
                _category: 'Games',
                _content: 'content'
            };

            expect(() => new Thread(thread._title, thread._imageUrl, thread._tags, thread._category, thread._content)).to.not.throw();
        });

        it('not throw when category is valid - Media Watch', () => {
            const thread = {
                _title: 'title',
                _imageUrl: 'imageaksdjaskdjasd',
                _tags: 'tagsasd',
                _category: 'Media Watch',
                _content: 'content'
            };

            expect(() => new Thread(thread._title, thread._imageUrl, thread._tags, thread._category, thread._content)).to.not.throw();
        });

        it('throw when category is invalid', () => {
            const thread = {
                _title: 'title',
                _imageUrl: 'imageaksdjaskdjasd',
                _tags: 'tagsasd',
                _category: 'Random',
                _content: 'content'
            };

            expect(() => new Thread(thread._title, thread._imageUrl, thread._tags, thread._category, thread._content)).to.throw();
        });
    });
});
