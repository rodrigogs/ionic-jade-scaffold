'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const bower = require('bower');
const sass = require('gulp-sass');
const minifyCss = require('gulp-minify-css');
const rename = require('gulp-rename');
const jade = require('gulp-jade');
const inject = require('gulp-inject');
const sh = require('shelljs');
const runSequence = require('run-sequence');
const del = require('del');

const paths = {
  sass: ['scss/**/*.scss'],
  jade: ['jade/**/*.jade'],
  js: [
    'www/js/**/*.js',
    '!www/js/app.js',
    '!www/js/routes.js'
  ],
  css: ['www/css/**/*.css']
};

gulp.task('default', ['clean'], done => {
  runSequence('jade', 'sass', done);
});

gulp.task('clean', done => {
  del(['www/css', 'www/templates', 'www/index.html']).then(() => done());
});

gulp.task('sass', done => {
  gulp.src('scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('www/css/'))
    .on('end', () => injectResources(done));
});

gulp.task('jade', done => {
  gulp.src(paths.jade)
    .pipe(jade({
      pretty: true
    }))
    .on('error', console.error)
    .pipe(gulp.dest('www'))
    .on('end', () => injectResources(done));
});

gulp.task('watch', () => {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.jade, ['jade']);
});

gulp.task('install', ['git-check', 'default'], () => {
  return bower.commands.install()
    .on('log', data => {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', done => {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

function injectResources(done) {
  gulp.src('www/index.html')
    .pipe(inject(gulp.src(paths.js, {read: false}), {relative: true}))
    .pipe(inject(gulp.src(paths.css, {read: false}), {relative: true}))
    .pipe(gulp.dest('www'))
    .on('end', done);
}
