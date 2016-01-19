
var gulp       = require('gulp'),
    handlebars = require('handlebars'),
    hb         = require('gulp-hb'),
    rename     = require('gulp-rename');


gulp.task('default', function () {
  gulp.src('./source/templates/readme.hbs')
    .pipe(hb({
      bustCache: true,
      data: './podcasts.json',
      helpers: './source/helpers/**/*.js'
    }))
    .pipe(rename("README.md"))
    .pipe(gulp.dest('./'))
});
