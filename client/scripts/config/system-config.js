/* globals SystemJS */

SystemJS.config({
    transpiler: 'plugin-babel',
    map: {
        // plugins
        'plugin-babel': '/libs/systemjs-plugin-babel/plugin-babel.js',
        'systemjs-babel-build': '/libs/systemjs-plugin-babel/systemjs-babel-browser.js',

        // app
        'main': '/public/scripts/main.js',
        'utils': '/public/scripts/utils.js',
        'toastr': '/public/scripts/config/toastr-config.js',
        'requester': '/public/scripts/requester.js',
        'templates-compiler': '/public/scripts/templates-compiler.js',

        // services
        'auth-service': '/public/scripts/services/auth.js',
        'news-service': '/public/scripts/services/news.js',
        'articles-service': '/public/scripts/services/articles.js',
        'admin-service': '/public/scripts/services/admin.js',
        'forum-service': '/public/scripts/services/forum.js',
        'stats-service': '/public/scripts/services/stats.js',

        // controllers
        'controllers': '/public/scripts/controllers/index.js',
        'home-controller': '/public/scripts/controllers/home.js',
        'auth-controller': '/public/scripts/controllers/auth.js',
        'news-controller': '/public/scripts/controllers/news.js',
        'articles-controller': '/public/scripts/controllers/articles.js',
        'admin-controller': '/public/scripts/controllers/admin.js',
        'forum-controller': '/public/scripts/controllers/forum.js',

        // libs
        'jquery': '/libs/jquery/dist/jquery.js',
        'bootstrap': '/libs/bootstrap/dist/js/bootstrap.js',
        'navigo': '/libs/navigo/lib/navigo.js',
        'handlebars': '/libs/handlebars/dist/handlebars.js',
        'handlebars-paginate': '/libs/handlebars-paginate/index.js',
        'toastr-lib': '/libs/toastr/toastr.js',
        
        // tests
        'tests': '/tests/tests.js'
    }
});