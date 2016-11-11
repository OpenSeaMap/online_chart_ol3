var config = require('../config')

var gulp = require('gulp')
var path = require('path')
var eslint = require('gulp-eslint')

var options = {fix: true}

var prettify = function () {
  return function () {
    var jsSrc = path.resolve(config.root.src, config.tasks.js.src)
    return gulp.src(jsSrc + '/**/*.js')
      .pipe(eslint(options))
      .pipe(gulp.dest(jsSrc))
  }
}

gulp.task('prettify', prettify())
module.exports = prettify
