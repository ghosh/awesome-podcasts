
var gulp       = require('gulp'),
    handlebars = require('handlebars'),
    hb         = require('gulp-hb'),
    rename     = require('gulp-rename'),
    
    del = require('del'),
    runSequence   = require('run-sequence'),
    jeditor    = require("gulp-json-editor"),
    gulpSheets = require('gulp-google-spreadsheets'),
    beautify = require('gulp-jsbeautify'),
    streamify = require('gulp-streamify');

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
        if (rows[i]['description']) { podcasts[i]['description'] = rows[i]['description']; }
        if (rows[i]['category']) { podcasts[i]['category'] = rows[i]['category']; }
        if (rows[i]['source']) { podcasts[i]['source'] = rows[i]['source']; }
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
  .pipe(gulp.dest('./'));
})

gulp.task('cleanData', function() {
    return del(['./data/']);
});

gulp.task('sync', function(callback) {
    runSequence('fetchData', 'mutateData', 'cleanData', callback);
});

gulp.task('update', function () {
  gulp.src('./source/templates/readme.hbs')
    .pipe(hb({
      bustCache: true,
      data: './podcasts.json',
      helpers: './source/helpers/**/*.js',
      partials: './source/templates/partials/**/*.hbs'
    }))
    .pipe(rename("README.md"))
    .pipe(gulp.dest('./'))
});
