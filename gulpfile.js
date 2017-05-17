/* globals require __dirname */

const gulp = require('gulp'),
    concatCss = require('gulp-concat-css'),
    minifyCss = require('gulp-minify-css'),
    systemjsBuilder = require('gulp-systemjs-builder'),
    clean = require('gulp-clean'),
    inject = require('gulp-inject');

const path = require('path');

gulp.task('build-sjs', () => {
    var builder = systemjsBuilder();
    builder.loadConfig(path.join(__dirname, '/client/scripts/config/system-config.js'));

    builder.buildStatic('./client/scripts/main.js', 'scripts/main.min.js', {
        minify: true,
        mangle: false
    })
        .pipe(gulp.dest('./build'));
});

gulp.task('build-css', () => {
    gulp.src(['./node_modules/toastr/build/toastr.min.css', './client/stylesheets/**/*css'])
        .pipe(concatCss('styles.min.css', { rebaseUrls: false }))
        .pipe(minifyCss())
        .pipe(gulp.dest('./build/css'));
});

gulp.task('copy-fonts', () => {
    gulp.src('./client/fonts/**')
        .pipe(gulp.dest('./build/fonts'));
});

gulp.task('clean', () => {
    gulp.src('./build')
        .pipe(clean());
});

gulp.task('inject-html', () => {
    gulp.src('./client/index.html')
        .pipe(inject(gulp.src('./build/**/*.js', { read: false }), { ignorePath: '../build' }, { relative: true }))
        .pipe(inject(gulp.src('./build/**/*.css', { read: false }), { ignorePath: '../build' }, { relative: true }))
        .pipe(gulp.dest('./build'));
});