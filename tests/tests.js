/* globals mocha */

mocha.setup('bdd');

const mochaTestScripts = [
    './services/news-tests.js',
    './services/auth-tests.js',
    './controllers/auth-tests.js',
    './models/user-tests.js',
    './models/comment-tests.js',
    './models/threads-tests.js',
    './models/news-entry-tests.js',
    './utils/auth-utils-tests.js',
    './utils/utils-tests.js'
];

Promise
    .all(mochaTestScripts.map((script) => {
        return System.import(script);
    })).then(() => {
        mocha.run();
    })
    .catch(error => {
        console.error(error);
    });