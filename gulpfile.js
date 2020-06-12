var browserSync = require('browser-sync'),
    gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),    // добавляем префиксы
    concat = require('gulp-concat'),                // сборка файлов в один
    concatCss = require('gulp-concat-css'),         // сборка файлов в один
    sass = require('gulp-sass'),                    // препроцессор
    uglify = require('gulp-uglify'),                // сжатие js
    ejs = require("gulp-ejs"),                      // шаблонизатор HTML
    del = require('del'),                           // удаление
    rename = require('gulp-rename'),                // переименованиеvar
    gulpStylelint = require('gulp-stylelint'),      // linter
    gcmq = require('gulp-group-css-media-queries'); // комбинирует стили

gulp.task('gcmq', function () {
    return gulp.src('src/css/style.css')
        .pipe(gcmq())
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.stream());
});

gulp.task('lintCss', function lintCssTask() {
  return gulp.src('src/sass/block/*.scss')
    .pipe(gulpStylelint({
      reporters: [
        {formatter: 'string', console: true}
      ]
    }));
});

gulp.task('sass', function () {
  return gulp.src(['src/sass/core/*.scss', 'src/sass/plugin/**/*.scss', 'src/sass/block/**/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(concatCss('style.css'))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 4 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('src/css'));
});

gulp.task('js', function () {
  return gulp.src('src/js/plugin/**/*.js')
    .pipe(concat('plugin.js'))
    .pipe(uglify())
    .pipe(gulp.dest('src/js'));
});

gulp.task('ejs', function () {
  return gulp.src('src/template/ejs/*.ejs')
    .pipe(ejs())
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest('src/template'))
});

gulp.task('del', function() {
  return del('src/template/*.html');
});

gulp.task('sync', function () {
  browserSync.init({
    server: ['src', 'src/template']
  });

  gulp.watch(['src/template/*.html', 'src/js/*.js', 'src/media/', 'src/fonts/']).on('change', browserSync.reload);
  gulp.watch('src/sass/**/*.scss', gulp.series('sass', 'lintCss', 'gcmq'));
  gulp.watch('src/js/plugin/**/*.js', gulp.series('js'));
  gulp.watch('src/template/ejs/**/*.ejs', gulp.series('del', 'ejs'));
});

gulp.task('default', gulp.series('sass', 'lintCss', 'gcmq', 'js', 'ejs', 'sync'));
