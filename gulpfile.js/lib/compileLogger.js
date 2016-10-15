var gutil        = require("gulp-util")
var prettifyTime = require('./prettifyTime')
var handleErrors = require('./handleErrors')
var fs = require('fs');
var config       = require('../config')
var path   = require('path')
var mkdirp = require('mkdirp');

module.exports = function(err, stats) {
  if(err) throw new gutil.PluginError("webpack", err)

  var statColor = stats.compilation.warnings.length < 1 ? 'green' : 'yellow'

  mkdirp(config.root.debug, function(err) {
    if(err) throw new gutil.PluginError("webpack-debug-output", err)
    fs.writeFileSync(path.join(config.root.debug, 'webpack.json'), JSON.stringify(stats.toJson()));
  });

  if(stats.compilation.errors.length > 0) {
    stats.compilation.errors.forEach(function(error){
      handleErrors(error)
      statColor = 'red'
    })
  } else {
    var compileTime = prettifyTime(stats.endTime - stats.startTime)
    gutil.log('Compiled with', gutil.colors.cyan('webpack'), 'in', gutil.colors.magenta(compileTime))
  }
}
