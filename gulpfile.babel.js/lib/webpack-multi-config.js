var config = require('../config')

var path = require('path')
var webpack = require('webpack')
var WebpackManifest = require('./webpackManifest')
var licenseBanner = require('../licenseBanner')

module.exports = function (env) {
  var jsSrc = path.resolve(config.root.src, config.tasks.js.src)
  var jsDest = path.resolve(config.root.dest, config.tasks.js.dest)
  var publicPath = path.join(config.tasks.js.dest, '/')
  var filenamePattern = '[name].js'
  var extensions = config.tasks.js.extensions.map(function (extension) {
    return '.' + extension
  })

  var webpackConfig = {
    context: jsSrc,
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
      }),
      new webpack.BannerPlugin(licenseBanner),
      new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1})
    ],
    resolve: {
      root: jsSrc,
      extensions: [''].concat(extensions),
      modulesDirectories: ['bower_components', 'node_modules'],
      alias: {
        openlayers: 'openlayers/dist/ol-debug.js',
        jquerySidebar: 'sidebar-v2/js/jquery-sidebar.js',

        bootstrap: 'bootstrap-sass/assets/javascripts/bootstrap/',
        loadimage: 'javascript-load-image/js/load-image.js',
        'bootstrap-toggle': 'bootstrap-toggle/js/bootstrap-toggle.js',
        'knockout-bootstrap-toggle': 'knockout-bootstrap-toggle/ko.bindingHandlers.bootstrapToggle.js'
      }
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: [/node_modules/, /bower_components/]
        }, {
          test: /AUTHORS$/,
          loader: 'raw-loader',
          exclude: [/node_modules/, /bower_components/]
        }, {
          test: /\.svg$/,
          loader: 'raw-loader',
          exclude: [/node_modules/, /bower_components/]
        }, {
          test: /\.json$/,
          loader: 'json'
        }, {
          test: /\.scss$/,
          loaders: ['style', 'css', 'sass']
        }, {
          test: /\.css$/,
          loaders: ['style', 'css']
        }
      ],
      noParse: /node_modules\/openlayers\/dist\/ol-debug.js/
    }
  }

  if (env !== 'test') {
    // Karma doesn't need entry points or output settings
    webpackConfig.entry = config.tasks.js.entries

    webpackConfig.output = {
      path: path.normalize(jsDest),
      filename: filenamePattern,
      publicPath: publicPath
    }

    if (config.tasks.js.extractSharedJs) {
      // Factor out common dependencies into a shared.js
      webpackConfig.plugins.push(
        new webpack.optimize.CommonsChunkPlugin({
          name: 'shared',
          filename: filenamePattern
        })
      )
    }
  }

  if (env === 'development') {
    webpackConfig.devtool = 'source-map'
    webpack.debug = true
  }

  if (env === 'production') {
    webpackConfig.plugins.push(
      new WebpackManifest(publicPath, config.root.dest),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        'compress': false,
        'mangle': true
      }),
      new webpack.NoErrorsPlugin()
    )
  }

  return webpackConfig
}
