var browserSync           = require('browser-sync'),
    gulp                  = require('gulp'),
    autoprefixer          = require('gulp-autoprefixer'),
    cleanCSS              = require('gulp-clean-css'),
    concat                = require('gulp-concat'),
    concatCss             = require('gulp-concat-css'),
    imagemin              = require('gulp-imagemin'),
    sass                  = require('gulp-sass'),
    clean                 = require('gulp-clean'),
    uglify                = require('gulp-uglify');

gulp.task('sass', function() {
  return gulp.src(['src/app/style/core/*.scss', 'src/app/style/plugin/**/*.scss', 'src/app/style/block/**/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(concatCss('style.css'))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('src/app/style/css'))
    .pipe(browserSync.stream());
});

gulp.task('script', function() {
 return  gulp.src('src/app/script/plugin/**/*.js')
    .pipe(concat('plugin.js'))
    .pipe(uglify())
    .pipe(gulp.dest('src/app/script'));
});

gulp.task('sync', function() {
  browserSync.init({
    server: 'src'
  });

  gulp.watch(['src', '!src/app/style']).on('change', browserSync.reload);
  gulp.watch('src/app/style/**/*.scss', gulp.series('sass'));
});

gulp.task('default', gulp.parallel('sync', 'sass', 'script'));
//
// gulp.task('cssMin', function() {
//   return gulp.src('src/app/style/css/style.css')
//     .pipe(cleanCSS({compatibility: 'ie8'}))
//     .pipe(gulp.dest('src/build/app/style/css/'));
// });
//
// gulp.task('jsMin', function() {
//   return gulp.src('src/app/script/*js')
//     .pipe(uglify())
//     .pipe(gulp.dest('src/build/app/script/'));
// });
//
// gulp.task('imgMin', function() {
//   return gulp.src('src/app/media/**/*')
//     .pipe(imagemin())
//     .pipe(gulp.dest('src/build/app/media/'));
// });
//
// gulp.task('cleanFolder', function () {
//   return gulp.src('src/build', {read: false})
//     .pipe(clean());
// });
//
// gulp.task('build', gulp.series('cleanFolder', 'cssMin', 'jsMin', 'imgMin'));
