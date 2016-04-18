var config = require('../config')
if(!config.tasks.js) return

var path            = require('path')
var webpack         = require('webpack')
var webpackManifest = require('./webpackManifest')
var licenseBanner   = require('../licenseBanner')

module.exports = function(env) {
  var jsSrc = path.resolve(config.root.src, config.tasks.js.src)
  var jsDest = path.resolve(config.root.dest, config.tasks.js.dest)
  var publicPath = path.join(config.tasks.js.dest, '/')
  var filenamePattern = env === 'production' ? '[name]-[hash].js' : '[name].js'
  var extensions = config.tasks.js.extensions.map(function(extension) {
    return '.' + extension
  })

  var webpackConfig = {
    context: jsSrc,
    plugins: [
      new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery",
          "window.jQuery": "jquery"
      }),
      new webpack.BannerPlugin(licenseBanner)
    ],
    resolve: {
      root: jsSrc,
      extensions: [''].concat(extensions),
      modulesDirectories: ['bower_components', "node_modules"],
        alias:{
          openlayers: 'openlayers/dist/ol-debug.js',
          bootstrap: 'bootstrap-sass/assets/javascripts/bootstrap/',
          loadimage: 'javascript-load-image/js/load-image.js',
          'bootstrap-toggle': 'bootstrap-toggle/js/bootstrap-toggle.js',
          'knockout-bootstrap-toggle': 'knockout-bootstrap-toggle/ko.bindingHandlers.bootstrapToggle.js',
        }
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: [/node_modules/, /bower_components/]
        },{
          test: /\AUTHORS$/,
          loader: 'raw-loader',
          exclude: [/node_modules/, /bower_components/]
        },{
          test: /\.scss$/,
          loaders: ['style', 'css', 'sass']
        }
        /*,{
          test: require.resolve('jquerySidebar'),
          loader: 'imports?$=jquery!'
        }*/
      ]
    }
  }

  if(env !== 'test') {
    // Karma doesn't need entry points or output settings
    webpackConfig.entry = config.tasks.js.entries

    webpackConfig.output= {
      path: path.normalize(jsDest),
      filename: filenamePattern,
      publicPath: publicPath
    }

    if(config.tasks.js.extractSharedJs) {
      // Factor out common dependencies into a shared.js
      webpackConfig.plugins.push(
        new webpack.optimize.CommonsChunkPlugin({
          name: 'shared',
          filename: filenamePattern,
        })
      )
    }
  }

  if(env === 'development') {
    webpackConfig.devtool = 'source-map'
    webpack.debug = true
  }

  if(env === 'production') {
    webpackConfig.plugins.push(
      new webpackManifest(publicPath, config.root.dest),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        'compress': {
          'warnings': false
        },
        'mangle': true
      }),
      new webpack.NoErrorsPlugin()
    )
  }

  return webpackConfig
}
