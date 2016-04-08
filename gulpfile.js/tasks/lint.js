var config = require('../config')
if(!config.tasks.js) return

var gulp   = require('gulp')
var path   = require('path')
var eslint = require('gulp-eslint')

var options = (config.tasks.lint && config.tasks.lint.options) ? config.tasks.lint.options : {}

var lint = function() {
  return function() {
    var jsSrc = path.resolve(config.root.src, config.tasks.js.src)
    return gulp.src(jsSrc + '/**/*.js')
      .pipe(eslint(options))
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
  };
}

gulp.task('lint', lint())
module.exports = lint
