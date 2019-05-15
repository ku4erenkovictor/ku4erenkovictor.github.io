var gulp         = require('gulp'),
    browserSync  = require('browser-sync'), 
    concat       = require('gulp-concat'), 
    uglify       = require('gulp-uglifyjs'), 
    cssnano      = require('gulp-cssnano'), 
    rename       = require('gulp-rename'), 
    imagemin     = require('gulp-imagemin'), 
    pngquant     = require('imagemin-pngquant'), 
    cache        = require('gulp-cache'), 
    autoprefixer = require('gulp-autoprefixer'),
    spritesmith = require('gulp.spritesmith'), 
    sass = require('gulp-sass'),
    merge = require('merge-stream'),
    notify = require('gulp-notify');
    // gulp-compass
    // compass-mixins


gulp.task('css', function(){ 
    return gulp.src('src/css/**/*.css') 
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) 
        .pipe(gulp.dest('app/css')) 
        .pipe(browserSync.reload({stream: true})) 
});

gulp.task('sass', function () {
    gulp.src('src/scss/all.scss')
        .pipe( sass().on( 'error', notify.onError(
            {
                message: "<%= error.message %>",
                title  : "Sass Error!"
            } )))
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('app/css/'))
}) ;

gulp.task('browser-sync', function() { 
    browserSync({ 
        server: { 
            baseDir: 'app' 
        },
        notify: false 
    });
});

gulp.task('sprite', function () { // Создаем таск sprite
    var spriteData = gulp.src('src/sprite/*.png').pipe(spritesmith({ 
        imgName: 'sprite.png',
        cssName: 'sprite.css'
    }));
    // return spriteData.pipe(gulp.dest('app/img/')); // выгружаем спрайты в папку img
    var imgStream = spriteData.img
        .pipe(gulp.dest('app/img/'));

    var cssStream = spriteData.css
        .pipe(gulp.dest('src/css/'));

    return merge(imgStream, cssStream);
});


gulp.task('scripts', function() {
    return gulp.src('src/js/**/*.js')
        .pipe(concat('jquery.main.js')) 
        //.pipe(rename({suffix: '.min'})) 
        //.pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('app/js')); 
});

gulp.task('css-min', ['css'], function() {
    return gulp.src('app/css/all.css') 
        .pipe(cssnano()) // Сжимаем
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
});

gulp.task('watch', ['browser-sync', 'css', 'scripts', 'sprite', 'sass'], function() {
    //gulp.watch('src/css/**/*.css', ['css']);
    gulp.watch('src/scss/**/*.scss', ['sass']);
    gulp.watch('src/sprite/*.png', ['sprite']);
    gulp.watch('src/js/**/*.js', ['scripts']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
    gulp.watch('src/scss/**/*.scss', browserSync.reload);
});

gulp.task('img', function() {
    return gulp.src('src/images/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('app/images'));
});


gulp.task('clear', function () {
    return cache.clearAll();
});

gulp.task('build', ['watch']);