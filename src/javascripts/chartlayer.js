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

  self.index = options.index;
  warning(self.index !== undefined, 'The layer has no index set.');

  if (options.interactions) {
    self.interactions = options.interactions;
  } else {
    self.interactions = [];
  }
  return self;
}

import {PropTypes} from 'react'

export const LayerType = PropTypes.shape({
    visibleDefault: PropTypes.bool.isRequired,
    nameKey: PropTypes.string.isRequired,

    layer: PropTypes.object.isRequired, //ol.layer subclass
    interactions: PropTypes.arrayOf(
      PropTypes.object.isRequired // ol.interaction subclass
    )
})
