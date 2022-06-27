const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const del = require('del');
const rename = require('gulp-rename');
const cleanCss = require('gulp-clean-css');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const htmlmin = require('gulp-htmlmin');
const browserSync = require('browser-sync').create();
const size = require('gulp-size');

const paths = {
  styles: {
    src: 'src/styles/**/*.scss',
    dest: 'dist/css',
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'dist/js/',
  },
  img: {
    src: 'src/images/*',
    dest: 'dist/images'
  },
  html: {
    src: 'src/*.html',
    dest: 'dist'
  }
}

function clean() {
  return del(['dist'])
}

function html () {
  return gulp.src(paths.html.src)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(size({
      showFiles: true
    }))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream());
};

function scripts () {
  return gulp.src(paths.scripts.src)
  .pipe(sourcemaps.init())
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(uglify())
  .pipe(concat('main.min.js'))
  .pipe(sourcemaps.write('./'))
  .pipe(size({
    showFiles: true
  }))
  .pipe(gulp.dest(paths.scripts.dest))
  .pipe(browserSync.stream());
}

function styles () {
  return gulp.src(paths.styles.src)
  .pipe(sourcemaps.init())
  .pipe(sass())
  .pipe(autoprefixer({
    cascade: false
  }))
  .pipe(cleanCss())
  .pipe(rename({
    basename: 'main',
    suffix: '.min'
  }))
  .pipe(sourcemaps.write('./'))
  .pipe(size({
    showFiles: true
  }))
  .pipe(gulp.dest(paths.styles.dest))
  .pipe(browserSync.stream());
}

function watch () {
  browserSync.init({
    server: "./dist"
  });
  gulp.watch(paths.html.src, html)
  gulp.watch(paths.html.dest).on('change', browserSync.reload)
  gulp.watch(paths.styles.src, styles)
  gulp.watch(paths.scripts.src, scripts)
}

const build = gulp.series(clean, html, gulp.parallel(styles, scripts), watch);

exports.clean = clean;
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.build = build;
exports.default = build;