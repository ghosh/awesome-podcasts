
var gulp         = require('gulp'),
    handlebars   = require('handlebars'),
    hb           = require('gulp-hb'),
    rename       = require('gulp-rename'),
    del          = require('del'),
    runSequence  = require('run-sequence'),
    jeditor      = require("gulp-json-editor"),
    gulpSheets   = require('gulp-google-spreadsheets'),
    beautify     = require('gulp-jsbeautify'),
    streamify    = require('gulp-streamify');
    sass         = require('gulp-sass');
    autoprefixer = require('gulp-autoprefixer');
    cleanCSS     = require('gulp-clean-css');
    ghPages      = require('gulp-gh-pages');
    uglify       = require('gulp-uglify');
    browserSync  = require('browser-sync').create();


gulp.task('update', function () {
  gulp.src('./source/templates/index.hbs')
    .pipe(hb({
      bustCache: true,
      data: './source/data/podcasts.json',
      helpers: './source/helpers/**/*.js',
      partials: './source/templates/partials/**/*.hbs'
    }))
    .pipe(rename("index.html"))
    .pipe(gulp.dest('./build'))
});


gulp.task('fetchData', function () {
    return gulpSheets('1RgK3Vyb98EunVFQRb3nS-yy7iZWiBrL-4cs3I3hBWbk')
    .pipe(gulp.dest('./data'))
});


gulp.task('mutateData', function() {
  gulp.src("./data/podcasts.json")
  .pipe(streamify(jeditor(function (data) {
      var rows = data.rows;
      var podcasts = [];
      var root = {};
      
      for (var i=0,  len=rows.length; i < len; i++) {
        podcasts[i] = {};
        if (rows[i]['name']) { podcasts[i]['name'] = rows[i]['name']; }
        if (rows[i]['thumbnail']) { podcasts[i]['thumbnail'] = rows[i]['thumbnail']; }
        if (rows[i]['description']) { podcasts[i]['description'] = rows[i]['description']; }
        if (rows[i]['category']) { podcasts[i]['category'] = rows[i]['category']; }
        if (rows[i]['source']) { podcasts[i]['source'] = rows[i]['source']; }
        if (rows[i]['thumbnail']) { podcasts[i]['thumbnail'] = rows[i]['thumbnail']; }
        if (rows[i]['itunes']) { podcasts[i]['itunes'] = rows[i]['itunes']; }
        if (rows[i]['android']) { podcasts[i]['android'] = rows[i]['android']; }
        if (rows[i]['soundcloud']) { podcasts[i]['soundcloud'] = rows[i]['soundcloud']; }
        if (rows[i]['rss']) { podcasts[i]['rss'] = rows[i]['rss']; }
      }
      
      return root = {
        'podcasts' : podcasts
      }

  })))
  .pipe(beautify({brace_style: 'expand'}))
  .pipe(rename("podcasts.json"))
  .pipe(gulp.dest('./source/data/'));
})


gulp.task('cleanData', function() {
    return del(['./data/']);
});


gulp.task('sync', function(callback) {
    runSequence('fetchData', 'mutateData', 'cleanData', callback);
});


// SASS -> CSS, Autoprefix & Minification
gulp.task('sass', function () {
  return gulp.src('./source/assets/styles/main.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(gulp.dest('./build'))
.pipe(browserSync.stream());
});

gulp.task('compress', ['sass'], function () {
  return gulp.src('./source/assets/js/main.js')
    .pipe(uglify())
    .pipe(rename("main.js"))
    .pipe(gulp.dest('./build'));
});


// Once SASS and compress is done, call dev
gulp.task('dev', ['compress'], function() {
    browserSync.init({
        server: "./build"
    });
    gulp.watch("./source/assets/js/**/*.js", ['compress'])
    gulp.watch("./source/assets/styles/*.scss", ['sass']);
    gulp.watch("./source/templates/**/*.hbs", ['update']).on('change', browserSync.reload);
});


// Push to gh-pages
gulp.task('deploy', function() {
  return gulp.src('./build/**/*')
    .pipe(ghPages({
        'remoteUrl' : 'git@github.com:ghosh/awesome-podcasts.git'
    }));
});
