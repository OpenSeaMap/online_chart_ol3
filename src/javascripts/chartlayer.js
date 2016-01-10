'use strict';
var ko = require('knockout');

module.exports = function(context, options) {
  var self = {};
  self.visible = ko.observable(false || options.visible);
  self.name = ko.observable(options.name || 'New layer');

  self.layer = options.layer;
  console.assert(self.layer);

  self.layer.setVisible(self.visible());

  self.visible.subscribe(function(newValue) {
    self.layer.setVisible(newValue);
  });

  if (options.interactions) {
    self.interactions = options.interactions;
  } else {
    self.interactions = [];
  }
  return self;
};
