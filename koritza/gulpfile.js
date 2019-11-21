var
  autoprefixer = require('gulp-autoprefixer'),
  browserSync = require('browser-sync').create(),
  concat = require('gulp-concat'),
  del = require('del'),
  gulp = require('gulp'),
  imagemin = require('gulp-imagemin'),
  inject = require('gulp-inject'),
  plumber = require('gulp-plumber'),
  runSequence = require('run-sequence'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify');

var path = {
  devStyles: 'dev/styles',
  distStyles: 'dist/css',
  devScripts: 'dev/scripts',
  distScripts: 'dist/js',
  devImages: 'dev/images',
  distImages: 'dist/images'
};

var imgExp = '/**/*.+(png|jpg|jpeg|gif|svg)';

function errorHandler(err) {
  console.log(err);
  this.emit('end');
}

/* ========================================================================= */

////////////
// STYLES //
////////////
gulp.task('styles:inject', function () {
  var
    target = gulp.src(path.devStyles + '/main.scss'),
    sources = gulp.src([
      path.devStyles + '/vendors/*.scss',
      path.devStyles + '/common/index.scss',
      path.devStyles + '/components/*.scss',
      path.devStyles + '/blocks/*.scss',
      path.devStyles + '/layout/*.scss',
      path.devStyles + '/themes/*.scss',
      path.devStyles + '/helpers.scss'
    ], {
      read: false
    });

  return target
    .pipe(inject(sources, {
      relative: true
    }))
    .pipe(gulp.dest(path.devStyles));
});

gulp.task('styles:compile', function () {
  return gulp
    .src(path.devStyles + '/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded' // expanded, compressed
    }).on('error', sass.logError))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest(path.distStyles));
});


gulp.task('styles:prefix', function () {
  return gulp
    .src(path.distStyles + '/*.css')
    .pipe(autoprefixer({
      browsers: ['last 3 versions', 'ie >= 9', 'iOS >= 6', 'Android >= 4']
    }))
    .pipe(gulp.dest(path.distStyles));
});

gulp.task('styles', function (cb) {
  runSequence('styles:inject', 'styles:compile', 'styles:prefix', cb);
});

////////////
// SERVER //
////////////
gulp.task('bs:init', function () {
  browserSync.init({
    server: 'dist',
    ghostMode: false
  });
});

gulp.task('bs:init-ghost', function () {
  browserSync.init({
    server: 'dist'
  });
});

gulp.task('bs:reload', function () {
  browserSync.reload();
});

gulp.task('bs:reload-css', function () {
  browserSync.reload(path.distStyles + '/main.css');
});

/////////////
// SCRIPTS //
/////////////
gulp.task('scripts:concat', function () {
  return gulp
    .src([
      path.devScripts + '/_first.js',
      path.devScripts + '/libs/*.js',
      path.devScripts + '/vendors/*.js',
      path.devScripts + '/_last.js'
    ])
    .pipe(plumber({
      errorHandler: errorHandler
    }))
    .pipe(concat('main.js'))
    .pipe(gulp.dest(path.distScripts));
});

gulp.task('scripts:uglify', function () {
  return gulp
    .src(path.distScripts + '/main.js')
    .pipe(plumber({
      errorHandler: errorHandler
    }))
    .pipe(uglify())
    .pipe(gulp.dest(path.distScripts));
});

gulp.task('scripts', function (cb) {
  runSequence('scripts:concat', 'scripts:uglify', cb);
});

////////////
// IMAGES //
////////////
gulp.task('images:del', function () {
  return del.sync([path.distImages + '/**', '!' + path.distImages]);
});

gulp.task('images:copy', ['images:del'], function () {
  return gulp
    .src(path.devImages + imgExp)
    .pipe(gulp.dest(path.distImages));
});

gulp.task('images:min', function () {
  return gulp
    .src(path.distImages + imgExp)
    .pipe(imagemin())
    .pipe(gulp.dest(path.distImages));
});

gulp.task('images', function (cb) {
  runSequence('images:copy', 'images:min', cb);
});

///////////
// WATCH //
///////////
gulp.task('watch', function () {
  gulp.watch([
    path.devStyles + '/**/*.scss',
    '!' + path.devStyles + '/main.scss'
  ], function (e) {
    var tasks = ['styles:compile', 'bs:reload-css'];

    if(e.type === 'added' || e.type === 'deleted') {
      tasks.unshift('styles:inject');
    }

    runSequence.apply(null, tasks);
  });
  gulp.watch(path.devScripts + '/**/*.js', ['scripts:concat']);
  gulp.watch(path.devImages + imgExp, ['images:copy']);
  // gulp.watch(path.devScripts + '/**/*.js', ['scripts:concat', 'bs:reload']);
  // gulp.watch('dist/*.html', ['bs:reload']);
});

/* ========================================================================= */

gulp.task('default', function (cb) {
  runSequence(
    'styles:inject',
    ['scripts:concat', 'styles:compile', 'bs:init', 'watch'],
    cb
  );
});
gulp.task('dist', ['styles', 'scripts', 'images']);
