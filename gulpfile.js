var gulp                  = require('gulp'),
    sass                  = require('gulp-sass'),
    browserSync           = require('browser-sync'),
    concatCss             = require('gulp-concat-css'),
    autoprefixer          = require('gulp-autoprefixer'),
    imagemin              = require('gulp-imagemin'),
    uglify                = require('gulp-uglify'),
    concat                = require('gulp-concat');

gulp.task('sass', function() {
  gulp.src('src/app/style/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(concatCss('style.css'))
    .pipe(gulp.dest('src/app/style/css'));

  gulp.watch('src/app/style/**/*.scss', gulp.series('sass'));
});

gulp.task('script', function() {
  gulp.src('src/app/script/plugin/**/*.js')
    .pipe(concat('plugin.js'))
    .pipe(uglify())
    .pipe(gulp.dest('src/app/script'));

  gulp.watch('src/app/script/plugin/**/*.js', gulp.series('script'));
});

gulp.task('sync', function() {
  browserSync.init({
      server: "src"
  });
  gulp.watch("src").on('change', browserSync.reload);
});

gulp.task('default', gulp.parallel('sync', 'sass', 'script'));
