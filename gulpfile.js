/* globals require */

const gulp = require('gulp'),
    concatCss = require('gulp-concat-css'),
    minifyCss = require('gulp-minify-css'),
    systemjsBuilder = require('gulp-systemjs-builder');

gulp.task('build-sjs', () => {
    var builder = systemjsBuilder('./', './client/scripts/config/system-config.js');

    builder.buildStatic('./client/scripts/main.js', {
        minify: false,
        mangle: false
    })
        .pipe(gulp.dest('./build'));
});

gulp.task('build-css', () => {
    gulp.src(['./node_modules/toastr/build/toastr.min.css', './client/stylesheets/**/*css'])
        .pipe(concatCss('styles.min.css', { rebaseUrls: false }))
        .pipe(minifyCss())
        .pipe(gulp.dest('./client/stylesheets'));
});