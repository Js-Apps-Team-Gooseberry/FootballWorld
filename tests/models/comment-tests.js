/* globals describe it chai sinon beforeEach afterEach */

import * as utils from 'utils';
import { Comment } from 'comment-model';

const { expect } = chai;

describe('Comment model tests', () => {
    describe('constructor should', () => {
        let validateLengthStub;

        beforeEach(() => {
            validateLengthStub = sinon.stub(utils, 'validateStringLength').returns({});
        });

        afterEach(() => {
            validateLengthStub.restore();
        });

        it('assign values correctly', () => {
            const comment = {
                _content: 'content'
            };

            const validComment = new Comment(comment._content);

            expect(validComment).to.be.deep.equal(comment);
        });

        it('make a call to validateLength', () => {
            const comment = {
                _content: 'content'
            };

            new Comment(comment._content);

            expect(validateLengthStub).to.be.calledWith(comment._content);
        });
    });
});
