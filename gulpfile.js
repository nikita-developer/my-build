var browserSync = require('browser-sync'),
    gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),  // добавляем префиксы
    concat = require('gulp-concat'),              // сборка файлов в один
    concatCss = require('gulp-concat-css'),       // сборка файлов в один
    sass = require('gulp-sass'),                  // препроцессор
    uglify = require('gulp-uglify'),              // сжатие js
    del = require('del'),                         // удаление
    pug = require('gulp-pug'),                    // шаблонизатор HTML
    prettify = require('gulp-html-prettify');     // форматирование HTML

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

gulp.task('pug', function () {
  return gulp.src('src/template/pug/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('src/template'));
});

gulp.task('prettify', function() {
  return gulp.src('src/template/*.html')
    .pipe(prettify({
      indent_char: ' ',
      indent_size: 2
    }))
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
  gulp.watch('src/sass/**/*.scss', gulp.series('sass'));
  gulp.watch('src/js/plugin/**/*.js', gulp.series('js'));
  gulp.watch('src/template/pug/**/*.pug', gulp.series('del', 'pug', 'prettify'));
});

gulp.task('default', gulp.parallel('sync', 'sass', 'js', 'pug'));

// build

gulp.task('sass-build', function () {
  return gulp.src(['src/sass/core/*.scss', 'src/sass/plugin/**/*.scss', 'src/sass/block/**/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(concatCss('style.css'))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('build/css'));
});

gulp.task('js-build', function () {
  return gulp.src(['src/js/*.js'], {
    base: 'src'
  })
    .pipe(gulp.dest('build/'));
});

gulp.task('fonts-build', function () {
  return gulp.src(['src/fonts/**/*'], {
    base: 'src'
  })
    .pipe(gulp.dest('build/'));
});

gulp.task('pug-build', function () {
  return gulp.src('src/template/pug/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('build/template'));
});

gulp.task('prettify-build', function() {
  return gulp.src('build/template/*.html')
    .pipe(prettify({
      indent_char: ' ',
      indent_size: 2
    }))
    .pipe(gulp.dest('build/template'))
});

gulp.task('del-build', function() {
  return del('build');
});

gulp.task('build', gulp.series('del-build', 'sass-build', 'js', 'js-build', 'pug-build', 'prettify-build', 'fonts-build'));
