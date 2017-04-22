/* globals SystemJS */

SystemJS.config({
    transpiler: 'plugin-babel',
    map: {
        'plugin-babel': './babel/plugin-babel.js',
        'systemjs-babel-build': './babel/systemjs-babel-browser.js',

        // app start script
        'main': './public/scripts/main.js',

        // libs
        'jquery': './public/bower_components/jquery/dist/jquery.js',
        'bootstrap': './public/bower_components/bootstrap/dist/js/bootstrap.js'
    }
});