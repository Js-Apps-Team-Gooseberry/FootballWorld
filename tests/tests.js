/* globals mocha */

mocha.setup('bdd');

const mochaTestScripts = [
    './services/auth-tests.js'
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