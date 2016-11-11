var config = require('../config')
var ghPages = require('gulp-gh-pages')
var gulp = require('gulp')
var os = require('os')
var packageData = require('../../package.json')
var path = require('path')

var settings = {
  src: path.join(config.root.dest, '/**/*'),
  ghPages: {
    cacheDir: path.join(os.tmpdir(), packageData.name),
    force: true
  }
}

var deployTask = function () {
  return gulp.src(settings.src)
    .pipe(ghPages(settings.ghPages))
}

gulp.task('deploy', ['production'], deployTask)
module.exports = deployTask
