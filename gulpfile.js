var browserSync = require('browser-sync'),
    gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    concatCss = require('gulp-concat-css'),
    sass = require('gulp-sass'),
    rigger = require('gulp-rigger'),
    uglify = require('gulp-uglify'),
    del = require('del');

gulp.task('include', function () {
  return gulp.src('src/template/*.html')
    .pipe(rigger())
    .pipe(gulp.dest('src/'))
});

gulp.task('clean', function () {
  return del('src/*.html');
});

gulp.task('sass', function () {
  return gulp.src(['src/sass/core/*.scss', 'src/sass/plugin/**/*.scss', 'src/sass/block/**/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(concatCss('style.css'))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream());
});

gulp.task('js', function () {
  return gulp.src('src/js/plugin/**/*.js')
    .pipe(concat('plugin.js'))
    .pipe(uglify())
    .pipe(gulp.dest('src/js'));
});

gulp.task('sync', function () {
  browserSync.init({
    server: 'src'
  });

  gulp.watch(['src/template/**/*.html', 'src/js/*.js', 'src/media/', 'src/fonts/']).on('change', browserSync.reload);
  gulp.watch('src/sass/**/*.scss', gulp.series('sass'));
  gulp.watch('src/js/plugin/**/*.js', gulp.series('js'));
  gulp.watch('src/template/**/*.html', gulp.series('clean', 'include'));
});

gulp.task('default', gulp.parallel('sync', 'sass', 'js', 'include'));
