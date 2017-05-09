/* globals SystemJS */

if (typeof window == 'undefined') {
    SystemJS.config({
        baseURL: './',
        transpiler: 'plugin-babel',
        map: {
            // plugins
            'plugin-babel': './node_modules/systemjs-plugin-babel/plugin-babel.js',
            'systemjs-babel-build': './node_modules/systemjs-plugin-babel/systemjs-babel-browser.js',

            // app
            'main': './client/scripts/main.js',
            'utils': './client/scripts/utils.js',
            'toastr': './client/scripts/config/toastr-config.js',
            'requester': './client/scripts/requester.js',
            'templates-compiler': './client/scripts/templates-compiler.js',

            // services
            'auth-service': './client/scripts/services/auth.js',
            'news-service': './client/scripts/services/news.js',
            'articles-service': './client/scripts/services/articles.js',
            'admin-service': './client/scripts/services/admin.js',
            'forum-service': './client/scripts/services/forum.js',
            'stats-service': './client/scripts/services/stats.js',
            'search-service': './client/scripts/services/search.js',

            // controllers
            'controllers': './client/scripts/controllers/index.js',
            'home-controller': './client/scripts/controllers/home.js',
            'auth-controller': './client/scripts/controllers/auth.js',
            'news-controller': './client/scripts/controllers/news.js',
            'articles-controller': './client/scripts/controllers/articles.js',
            'admin-controller': './client/scripts/controllers/admin.js',
            'forum-controller': './client/scripts/controllers/forum.js',

            // models
            'user-model': './client/scripts/models/user.js',
            'news-entry-model': './client/scripts/models/news-entry.js',
            'comment-model': './client/scripts/models/comment.js',
            'thread-model': './client/scripts/models/thread.js',

            // libs
            'jquery': './node_modules/jquery/dist/jquery.js',
            'bootstrap': './node_modules/bootstrap/dist/js/bootstrap.js',
            'navigo': './node_modules/navigo/lib/navigo.js',
            'handlebars': './node_modules/handlebars/dist/handlebars.js',
            'handlebars-paginate': './node_modules/handlebars-paginate/index.js',
            'toastr-lib': './node_modules/toastr/toastr.js',

            // tests
            'tests': '/tests/tests.js'
        }
    });
} else {
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
            'search-service': '/public/scripts/services/search.js',

            // controllers
            'controllers': '/public/scripts/controllers/index.js',
            'home-controller': '/public/scripts/controllers/home.js',
            'auth-controller': '/public/scripts/controllers/auth.js',
            'news-controller': '/public/scripts/controllers/news.js',
            'articles-controller': '/public/scripts/controllers/articles.js',
            'admin-controller': '/public/scripts/controllers/admin.js',
            'forum-controller': '/public/scripts/controllers/forum.js',

            // models
            'user-model': '/public/scripts/models/user.js',
            'news-entry-model': '/public/scripts/models/news-entry.js',
            'comment-model': '/public/scripts/models/comment.js',
            'thread-model': '/public/scripts/models/thread.js',

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
}