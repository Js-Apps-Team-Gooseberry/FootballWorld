/* globals SystemJS */

SystemJS.config({
    transpiler: 'plugin-babel',
    map: {
        'plugin-babel': '/babel/plugin-babel.js',
        'systemjs-babel-build': '/babel/systemjs-babel-browser.js',

        // app start script
        'main': '/public/scripts/main.js',
        'toastr': '/public/scripts/config/toastr-config.js',

        // libs
        'jquery': '/public/bower_components/jquery/dist/jquery.js',
        'bootstrap': '/public/bower_components/bootstrap/dist/js/bootstrap.js',
        'navigo': '/public/bower_components/navigo/lib/navigo.js',
        'handlebars': '/public/bower_components/handlebars/handlebars.amd.js',        
        'toastr-lib': '/public/bower_components/toastr/toastr.js'
    }
});