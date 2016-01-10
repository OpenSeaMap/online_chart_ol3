var config = require('../config')
if(!config.tasks.js) return

var gulp    = require('gulp')
var path            = require('path')
var eslint = require('gulp-eslint')

var lint = function() {
  return () => {
    var jsSrc = path.resolve(config.root.src, config.tasks.js.src)
    return gulp.src(jsSrc + '/**/*.js')
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
  };
}

gulp.task('lint', lint())
module.exports = lint
