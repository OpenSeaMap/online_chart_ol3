'use strict';
var warning = require('fbjs/lib/warning');

module.exports = function(context, options) {
  var self = {};
  self.visibleDefault = false || options.visible;
  self.nameKey = options.nameKey;
  warning(self.nameKey, 'The layer has no key for the name.');

  self.layer = options.layer;
  warning(self.layer, 'The layer has no layer object.');

  self.index = options.index;
  warning(self.index, 'The layer has no index set.');

  if (options.interactions) {
    self.interactions = options.interactions;
  } else {
    self.interactions = [];
  }
  return self;
};
