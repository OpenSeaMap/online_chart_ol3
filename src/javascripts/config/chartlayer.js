/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict';

var warning = require('fbjs/lib/warning');

export default function(context, options) {
  var self = {};
  self.visibleDefault = false || options.visibleDefault;
  self.nameKey = options.nameKey;
  warning(self.nameKey, 'The layer has no key for the name.');

  self.layer = options.layer;
  warning(self.layer, 'The layer has no layer object.');

  self.id = options.id;
  warning(self.id !== undefined, 'The layer has no ID set.');

  self.urlIndex2013 = options.urlIndex2013 || -1;
  self.urlIndex2016 = options.urlIndex2016 || -1;

  if (options.interactions) {
    self.interactions = options.interactions;
  } else {
    self.interactions = [];
  }
  return self;
}

import { PropTypes } from 'react'

export const LayerType = PropTypes.shape({
  visibleDefault: PropTypes.bool.isRequired,
  nameKey: PropTypes.string.isRequired,

  layer: PropTypes.object.isRequired, //ol.layer subclass
  interactions: PropTypes.arrayOf(
    PropTypes.object // ol.interaction subclass
  )
})
