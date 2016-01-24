var config  = require('../config')
var ghPages = require('gulp-gh-pages')
var gulp    = require('gulp')
var open    = require('open')
var os      = require('os')
var package = require('../../package.json')
var path    = require('path')
var sftp = require('gulp-sftp');

var settings = {
  url: package.homepage,
  src: path.join(config.root.dest, '/**/*'),
  sftp: {
    host: '222142.webhosting69.1blu.de',
    user: 'ftp222142-2697028',
    remotePath: '/hp/cn/ac/fs/www/osm-dev-map'
  }
}

var deployTask = function() {
  return gulp.src(settings.src)
    .pipe(sftp(settings.sftp))
    .on('end', function(){
      open(settings.url)
    })
}

gulp.task('deploy', ['production'], deployTask)
module.exports = deployTask
