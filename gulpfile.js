const gulp = require('gulp');
const babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');
const uglify = require('gulp-uglify');
const lineec = require('gulp-line-ending-corrector');

// location of main scss file
const sassSrc = './src/styles/main.scss';
// location of css folder to send compiled scss
const compiledSass = 'src/css';

function css() {
  return gulp
    .src(sassSrc)
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(
      sass({
        outputStyle: 'expanded'
      }).on('error', sass.logError)
    )
    .pipe(autoprefixer('last 2 versions'))
    .pipe(sourcemaps.write())
    .pipe(lineec())
    .pipe(gulp.dest(compiledSass));
}

// css files to be concatenated and minified (vendor files first)
const cssSrc = ['src/css/main.css'];
// location on final minified css file
const docsCSS = 'docs/styles';
// name of minified css file
const minCSS = 'main.min.css';

function concatCSS() {
  return gulp
    .src(cssSrc)
    .pipe(sourcemaps.init({ loadMaps: true, largeFile: true }))
    .pipe(concat(minCSS))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('./maps/'))
    .pipe(lineec())
    .pipe(gulp.dest(docsCSS));
}

// concats js files in specific order (vendors first)
const jsSRC = ['src/scripts/main.js'];
// name of minified js file
const minJS = 'main.min.js';
// destination of minified js file
const docsJS = 'docs/scripts';

function javascript() {
  return gulp
    .src(jsSRC)
    .pipe(concat(minJS))
    .pipe(
      babel({
        presets: [
          [
            '@babel/env',
            {
              modules: false
            }
          ]
        ]
      })
    )
    .pipe(uglify())
    .pipe(lineec())
    .pipe(gulp.dest(docsJS));
}

// images source folders/files
const imgSrc = 'src/images/**/*';
// images docs file
const imgDocs = 'docs/images/';

function imgmin() {
  return gulp
    .src(imgSrc)
    .pipe(changed(imgDocs))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 })
      ])
    )
    .pipe(gulp.dest(imgDocs));
}

// js files to watch
const jsWatch = './src/scripts/**/*.js';
// scss files to watch
const scssWatch = './src/styles/**/*.scss';
// image files to watch
const imgWatch = 'src/images/**/*';

// browser reload on changes to these files
const jsReload = `docs/scripts/main.min.js`;
const cssReload = `docs/styles/main.min.css`;
const htmlReload = './docs/*.html';

function watch() {
  browserSync.init({
    browser: 'safari',
    server: {
      baseDir: './docs/'
    }
  });
  gulp.watch(scssWatch, gulp.series([css, concatCSS]));
  gulp.watch(jsWatch, javascript);
  gulp.watch(imgWatch, imgmin);
  gulp.watch([jsReload, cssReload, htmlReload]).on('change', browserSync.reload);
}

exports.css = css;
exports.concatCSS = concatCSS;
exports.javascript = javascript;
exports.watch = watch;
exports.imgmin = imgmin;

const docs = gulp.parallel(watch);
gulp.task('default', docs);
