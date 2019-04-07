var gulp                  = require('gulp'),
    sass                  = require('gulp-sass'),
    browserSync           = require('browser-sync'),
    concatCss             = require('gulp-concat-css'),
    autoprefixer          = require('gulp-autoprefixer'),
    clean                 = require('gulp-clean'),
    imagemin              = require('gulp-imagemin'),
    fsync                 = require('gulp-files-sync'),
    uglify                = require('gulp-uglify'),
    concat                = require('gulp-concat');

gulp.task('sass', function() {
  gulp.src('src/app/style/block/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(concatCss("style.css"))
    .pipe(gulp.dest('src/app/style/css'));

  gulp.src('src/app/style/plugin/**/*.css')
    .pipe(concatCss("plugin.css"))
    .pipe(gulp.dest('src/app/style/css/'));

  gulp.src('src/app/fonts/*.css')
    .pipe(concatCss("fonts.css"))
    .pipe(gulp.dest('src/app/style/css/'));

  gulp.watch('src/app/fonts/*.css', gulp.series('sass'));
  gulp.watch('src/app/style/block/**/*.scss', gulp.series('sass'));
  gulp.watch('src/app/style/plugin/**/*.css', gulp.series('sass'));
});

gulp.task('script', function() {
  gulp.src('src/app/script/plugin/**/*.js')
    .pipe(concat('plugin.js'))
    .pipe(uglify())
    .pipe(gulp.dest('src/app/script'));

  gulp.watch('src/app/script/**/*.js', gulp.series('script'));
});

gulp.task('sync', function() {
  browserSync.init({
      server: "src"
  });
  gulp.watch("src").on('change', browserSync.reload);
});

gulp.task('default', gulp.parallel('sync', 'sass', 'script'));

gulp.task('default', gulp.parallel('sync', 'sass', 'script'));

// gulp.task('media', function() {
//   gulp.src('src/frontend/media/**/*')
//     .pipe(imagemin())
//     .pipe(gulp.dest('src/app/media/'));
//   gulp.watch('src/frontend/media/**/*', gulp.series('cleare', 'media'));
// });
