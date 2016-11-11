var config = require('./gulpfile.babel.js/config')
var webpackConfig = require('./gulpfile.babel.js/lib/webpack-multi-config')
var path = require('path')

var testSrc = path.join(config.root.src, config.tasks.js.src, '/**/__tests__/*')

var karmaConfig = {
  frameworks: ['mocha', 'sinon-chai'],
  files: [ testSrc ],
  preprocessors: {},
  webpack: webpackConfig('test'),
  singleRun: process.env.TRAVIS === 'true',
//  reporters: ['nyan'],
  browsers: ['PhantomJS']
}

karmaConfig.preprocessors[testSrc] = ['webpack']

module.exports = function (config) {
  config.set(karmaConfig)
}
