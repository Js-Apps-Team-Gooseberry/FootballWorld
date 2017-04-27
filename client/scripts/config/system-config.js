/* globals SystemJS */

SystemJS.config({
    transpiler: 'plugin-babel',
    map: {
        // plugins
        'plugin-babel': '/babel/plugin-babel.js',
        'systemjs-babel-build': '/babel/systemjs-babel-browser.js',

        // app
        'main': '/public/scripts/main.js',
        'utils': '/public/scripts/utils.js',
        'toastr': '/public/scripts/config/toastr-config.js',
        'requester': '/public/scripts/requester.js',
        'templates-compiler': '/public/scripts/templates-compiler.js',

        // services
        'auth-service': '/public/scripts/services/auth.js',

        // controllers
        'controllers': '/public/scripts/controllers/index.js',
        'home-controller': '/public/scripts/controllers/home.js',
        'auth-controller': '/public/scripts/controllers/auth.js',
        'news-controller': '/public/scripts/controllers/news.js',

        // libs
        'jquery': '/public/bower_components/jquery/dist/jquery.js',
        'bootstrap': '/public/bower_components/bootstrap/dist/js/bootstrap.js',
        'navigo': '/public/bower_components/navigo/lib/navigo.js',
        'handlebars': '/public/bower_components/handlebars/handlebars.js',
        'toastr-lib': '/public/bower_components/toastr/toastr.js'
    }
});