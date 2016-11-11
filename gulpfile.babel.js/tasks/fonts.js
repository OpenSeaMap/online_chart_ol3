var config = require('../config')

var browserSync = require('browser-sync')
var changed = require('gulp-changed')
var gulp = require('gulp')
var path = require('path')

var paths = {
  src: path.join(config.root.src, config.tasks.fonts.src, '/**/*'),
  dest: path.join(config.root.dest, config.tasks.fonts.dest)
}

var fontsTask = function () {
  return gulp.src(require('main-bower-files')({
    filter: '**/*.{eot,svg,ttf,woff,woff2}'
  }).concat(paths.src))
    .pipe(changed(paths.dest)) // Ignore unchanged files
    .pipe(gulp.dest(paths.dest))
    .pipe(browserSync.stream())
}

gulp.task('fonts', fontsTask)
module.exports = fontsTask
