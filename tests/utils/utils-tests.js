/* globals chai describe it */

import { formatDate, validateStringLength, validateEmail } from 'utils';
const { expect } = chai;

describe('Utils tests', () => {
    describe('formatDate should', () => {
        it('return formatted date in specified format', () => {
            const date = new Date('5, 24, 2012 13:24');

            let result = formatDate(date);
            let expected = '24 May 2012, 13:24';
            expect(result).to.be.equal(expected);
        });
    });

    describe('validateStringLength should', () => {
        const targetName = 'string';
        const minValue = 5;
        const maxValue = 15;

        it('throw when string value is lower than minValue', () => {
            const shortString = 'four';
            expect(() => validateStringLength(shortString, minValue, maxValue, targetName)).to.throw(Error);
        });

        it('throw when string value is greater than maxValue', () => {
            const longString = '0123456789123456';
            expect(() => validateStringLength(longString, minValue, maxValue, targetName)).to.throw(Error);
        });

        it('not throw when value is in correct limits', () => {
            const longString = '012345678912345';
            expect(() => validateStringLength(longString, minValue, maxValue, targetName)).to.not.throw();
        });
    });

    describe('validateEmail should', () => {
        it('throw when email doesn\'t include @', () => {
            expect(() => validateEmail('azsymnakon.com')).to.throw(Error);
        });

        it('throw when email doesn\'t include a dot', () => {
            expect(() => validateEmail('azsym@nakoncom')).to.throw(Error);
        });

        it('throw when top level domain is too short', () => {
            expect(() => validateEmail('azsymna@kon.c')).to.throw(Error);
        });

        it('throw when the value includes special chars', () => {
            expect(() => validateEmail('azsy;mna@kon.c')).to.throw(Error);
        });

        it('throw when the value includes white-spaces', () => {
            expect(() => validateEmail('azsym na@asd.asd')).to.throw(Error);
        });

        it('not throw when the value is valid', () => {
            expect(() => validateEmail('azsym@na.con')).to.not.throw(Error);
        });
    });
});