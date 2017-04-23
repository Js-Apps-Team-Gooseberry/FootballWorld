/* globals SystemJS */

SystemJS.config({
    transpiler: 'plugin-babel',
    map: {
        'plugin-babel': '/babel/plugin-babel.js',
        'systemjs-babel-build': '/babel/systemjs-babel-browser.js',

        // app start script
        'main': '/public/scripts/main.js',
        'toastr': '/public/scripts/config/toastr-config.js',
        'requester': '/public/scripts/requester.js',
        'templates-compiler': '/public/scripts/templates-compiler.js',

        // controllers
        'home-controller': '/public/scripts/controllers/home.js',

        // libs
        'jquery': '/public/bower_components/jquery/dist/jquery.js',
        'bootstrap': '/public/bower_components/bootstrap/dist/js/bootstrap.js',
        'navigo': '/public/bower_components/navigo/lib/navigo.js',
        'handlebars': '/public/bower_components/handlebars/handlebars.js',        
        'toastr-lib': '/public/bower_components/toastr/toastr.js'
    }
});