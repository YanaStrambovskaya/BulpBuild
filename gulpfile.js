const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const del = require('del');
const rename = require('gulp-rename');
const cleanCss = require('gulp-clean-css');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

const paths = {
  styles: {
    src: './src/styles/**/*.scss',
    dest: './dist/css',
  },
  scripts: {
    src: './src/scripts/**/*.js',
    dest: './dist/js/',
  },
}

function clean() {
  return del(['./dist'])
}

function scripts () {
  return gulp.src(paths.scripts.src, {
    sourcemaps: true
  })
  .pipe(babel())
  .pipe(uglify())
  .pipe(concat('main.min.js'))
  .pipe(gulp.dest(paths.scripts.dest))
}

function styles () {
  return gulp.src(paths.styles.src, {
    sourcemap: true
  })
  .pipe(sass())
  .pipe(cleanCss())
  .pipe(rename({
    basename: 'main',
    suffix: '.min'
  }))
  .pipe(gulp.dest(paths.styles.dest))
}

function watch () {
  gulp.watch(paths.styles.src, styles)
  gulp.watch(paths.scripts.src, scripts)
}

const build = gulp.series(clean, gulp.parallel(styles, scripts), watch);

exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.build = build;
exports.default = build;