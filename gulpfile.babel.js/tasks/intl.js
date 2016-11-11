var config = require('../config')

var gulp = require('gulp')
var fs = require('fs')
var globSync = require('glob').sync
var mkdirpSync = require('mkdirp').sync
var path = require('path')

const MESSAGES_PATTERN = path.join(config.root.debug, config.tasks.intl.messagesPattern)
const LANG_DIR = path.join(config.root.intl, config.tasks.intl.langDir)

const intlTask = (callback) => {
  // Aggregates the default messages that were extracted from the app's
  // React components via the React Intl Babel plugin. An error will be thrown if
  // there are messages in different components that use the same `id`. The result
  // is a flat collection of `id: message` pairs for the app's default locale.
  var defaultMessages = globSync(MESSAGES_PATTERN)
      .map((filename) => fs.readFileSync(filename, 'utf8'))
      .map((file) => JSON.parse(file))
      .reduce((collection, descriptors) => {
        descriptors.forEach(({id, defaultMessage}) => {
          if (collection.hasOwnProperty(id)) {
            throw new Error(`Duplicate message id: ${id}`)
          }

          collection[id] = defaultMessage
        })

        return collection
      }, {})

  mkdirpSync(LANG_DIR)
  fs.writeFileSync(path.join(LANG_DIR, 'default.json'), JSON.stringify(defaultMessages, null, 2))

  callback()
}

gulp.task('intl', intlTask)
module.exports = intlTask
