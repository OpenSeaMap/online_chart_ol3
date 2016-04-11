var config = require('../config')
if(!config.tasks.js) return

var gulp        = require('gulp');
var path        = require('path')
var gutil       = require('gulp-util');
var through     = require('through2');
var esformatter = require('esformatter');
esformatter.register(require('esformatter-jsx'));

var jsxFileFormater = function (options) {
  options = options || {};
  return through.obj(function (file, encoding, callback) {
    try {
      if (file.contents) {
        var str = file.contents.toString(encoding || 'utf8');
        file.contents = new Buffer(esformatter.format(str, options));
      }
    } catch (err) {
      return callback(new gutil.PluginError('prettify', err, options));
    }
    callback(null, file);
  });
};

var prettify = function() {
    var jsSrc = path.resolve(config.root.src, config.tasks.js.src)
    return gulp.src(path.join(jsSrc, '/**/*.js'))
      .pipe(jsxFileFormater(config.tasks.prettify.options))
      .pipe(gulp.dest(jsSrc))
};

gulp.task('prettify', prettify)
module.exports = prettify
