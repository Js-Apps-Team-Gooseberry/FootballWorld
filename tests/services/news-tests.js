/* globals describe it chai sinon beforeEach afterEach */

import * as newsService from 'news-service';
import * as requester from 'requester';

const { expect } = chai;

describe('News service tests', () => {
    describe('getNotDeletedArticlesByPage should', () => {
        const page = 1;
        const pageSize = 2;

        let getJsonStub;
        beforeEach(() => {
            getJsonStub = sinon.stub(requester, 'getJSON').returns(Promise.resolve());
        });

        afterEach(() => {
            getJsonStub.restore();
        });

        it('make a put request ot correct url', (done) => {
            newsService.getNotDeletedArticlesByPage(page, pageSize)
                .then(() => {
                    expect(getJsonStub).to.be.calledWith('/api/news/get-all-for-users');
                })
                .then(done, done);
        });

        it('make a put request ot correct params', (done) => {
            let data = {
                page,
                pageSize
            };

            getJsonStub.returns(Promise.resolve(data));

            newsService.getNotDeletedArticlesByPage(page, pageSize)
                .then(() => {
                    expect(getJsonStub.args[0][1]).to.be.deep.equal(data);
                })
                .then(done, done);
        });

        it('make a put request with correctly named headers', (done) => {
            let data = {
                page,
                pageSize
            };

            getJsonStub.returns(Promise.resolve(data));

            newsService.getNotDeletedArticlesByPage(page, pageSize)
                .then(() => {
                    expect(getJsonStub.args[0][1]).to.include.keys('page', 'pageSize');
                })
                .then(done, done);
        });

        describe('getById should', () => {
            let postJsonStub;
            beforeEach(() => {
                postJsonStub = sinon.stub(requester, 'postJSON').returns(Promise.resolve());
            });

            afterEach(() => {
                postJsonStub.restore();
            });

            it('make a post request to correct url', (done) => {
                const id = '1';
                newsService.getById(id)
                    .then(() => {
                        expect(postJsonStub).to.be.calledWith('/api/news/get-by-id');
                    })
                    .then(done, done);
            });


            it('make a post request with correct params', (done) => {
                const newsEntryId = '1';
                newsService.getById(newsEntryId)
                    .then(() => {
                        expect(postJsonStub.args[0][1]).to.be.deep.equal({ newsEntryId });
                    })
                    .then(done, done);
            });


            it('make a post request with body with correctly named properties', (done) => {
                const id = '1';
                newsService.getById(id)
                    .then(() => {
                        expect(postJsonStub.args[0][1]).to.include.keys('newsEntryId');
                    })
                    .then(done, done);
            });
        });

        describe('getByTags should', () => {
            let postJsonStub;
            beforeEach(() => {
                postJsonStub = sinon.stub(requester, 'postJSON').returns(Promise.resolve());
            });

            afterEach(() => {
                postJsonStub.restore();
            });

            it('make post request to correct url', (done) => {
                const tags = 'tags';
                const currentArticle = 'current';
                const articlesCount = 1;
                newsService.getByTags(tags, currentArticle, articlesCount)
                    .then(() => {
                        expect(postJsonStub).to.be.calledWith('/api/news/get-by-tag');
                    })
                    .then(done, done);
            });

            it('make post request with correct data', (done) => {
                const tags = 'tags';
                const currentArticle = 'current';
                const articlesCount = 1;
                newsService.getByTags(tags, currentArticle, articlesCount)
                    .then(() => {
                        expect(postJsonStub.args[0][1]).to.be.deep.equal({ tags, currentArticle, articlesCount });
                    })
                    .then(done, done);
            });

            it('make post request with correctly named properties in body', (done) => {
                const tags = 'tags';
                const currentArticle = 'current';
                const articlesCount = 1;
                newsService.getByTags(tags, currentArticle, articlesCount)
                    .then(() => {
                        expect(postJsonStub.args[0][1]).to.include.keys('tags', 'currentArticle', 'articlesCount');
                    })
                    .then(done, done);
            });
        });

        describe('getAsideLatest should', () => {
            let postJsonStub;
            beforeEach(() => {
                postJsonStub = sinon.stub(requester, 'postJSON').returns(Promise.resolve());
            });

            afterEach(() => {
                postJsonStub.restore();
            });

            it('make post request to correct url', (done) => {
                const articlesCount = 1;
                const currentArticleId = 'current';
                newsService.getAsideLatest(articlesCount, currentArticleId)
                    .then(() => {
                        expect(postJsonStub).to.be.calledWith('/api/news/get-aside-latest');
                    })
                    .then(done, done);
            });

            it('make post request with correct data', (done) => {
                const articlesCount = 1;
                const currentArticleId = 'current';
                newsService.getAsideLatest(articlesCount, currentArticleId)
                    .then(() => {
                        expect(postJsonStub.args[0][1]).to.be.deep.equal({ articlesCount, currentArticleId });
                    })
                    .then(done, done);
            });

            it('make post request with correctly named properties in body', (done) => {
                const articlesCount = 1;
                const currentArticleId = 'current';
                newsService.getAsideLatest(articlesCount, currentArticleId)
                    .then(() => {
                        expect(postJsonStub.args[0][1]).to.include.keys('currentArticleId', 'articlesCount');
                    })
                    .then(done, done);
            });
        });

        describe('createNewEntry should', () => {
            let postJsonStub;
            beforeEach(() => {
                postJsonStub = sinon.stub(requester, 'postJSON').returns(Promise.resolve());
            });

            afterEach(() => {
                postJsonStub.restore();
            });

            it('make post request to correct url', (done) => {
                const title = 1;
                const description = 'current';
                const imageUrl = 'current';
                const content = 'current';
                const tags = 'current';

                newsService.createNewEntry(title, description, imageUrl, content, tags)
                    .then(() => {
                        expect(postJsonStub).to.be.calledWith('/api/news/create');
                    })
                    .then(done, done);
            });

            it('make post request with correct data', (done) => {
                const title = 1;
                const description = 'current';
                const imageUrl = 'current';
                const content = 'current';
                const tags = 'current';

                newsService.createNewEntry(title, description, imageUrl, content, tags)
                    .then(() => {
                        expect(postJsonStub.args[0][1]).to.be.deep.equal({ title, description, imageUrl, content, tags });
                    })
                    .then(done, done);
            });

            it('make post request with correctly named properties in body', (done) => {
                const title = 1;
                const description = 'current';
                const imageUrl = 'current';
                const content = 'current';
                const tags = 'current';

                newsService.createNewEntry(title, description, imageUrl, content, tags)
                    .then(() => {
                        expect(postJsonStub.args[0][1]).to.include.keys('title', 'description', 'imageUrl', 'content', 'tags');
                    })
                    .then(done, done);
            });
        });

        describe('editNewsEntry should', () => {
            let putJsonStub;
            beforeEach(() => {
                putJsonStub = sinon.stub(requester, 'putJSON').returns(Promise.resolve());
            });

            afterEach(() => {
                putJsonStub.restore();
            });

            it('make put request to correct url', (done) => {
                const articleId = '1';
                const title = 1;
                const description = 'current';
                const imageUrl = 'current';
                const content = 'current';
                const tags = 'current';

                newsService.editNewsEntry(articleId, title, description, imageUrl, content, tags)
                    .then(() => {
                        expect(putJsonStub).to.be.calledWith('/api/news/edit');
                    })
                    .then(done, done);
            });

            it('make put request with correct data', (done) => {
                const articleId = '1';
                const title = 1;
                const description = 'current';
                const imageUrl = 'current';
                const content = 'current';
                const tags = 'current';

                newsService.editNewsEntry(articleId, title, description, imageUrl, content, tags)
                    .then(() => {
                        expect(putJsonStub.args[0][1]).to.be.deep.equal({ articleId, title, description, imageUrl, content, tags });
                    })
                    .then(done, done);
            });

            it('make put request with correctly named properties in body', (done) => {
                const articleId = '1';
                const title = 1;
                const description = 'current';
                const imageUrl = 'current';
                const content = 'current';
                const tags = 'current';

                newsService.editNewsEntry(articleId, title, description, imageUrl, content, tags)
                    .then(() => {
                        expect(putJsonStub.args[0][1]).to.include.keys('articleId', 'title', 'description', 'imageUrl', 'content', 'tags');
                    })
                    .then(done, done);
            });
        });
    });
});