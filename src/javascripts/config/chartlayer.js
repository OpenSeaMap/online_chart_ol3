/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict'

var warning = require('fbjs/lib/warning')

export default function (context, options) {
  var self = {}

  self.id = options.id
  warning(self.id !== undefined, 'The layer has no ID set.')

  self.visibleDefault = false || options.visibleDefault

  self.nameKey = options.nameKey
  warning(self.nameKey, 'The layer has no key for the name.')

  self.isBaseLayer = false || options.isBaseLayer

  self.urlIndex2013 = options.urlIndex2013 || -1

  self.urlIndex2016 = options.urlIndex2016 || 0
  if (!self.isBaseLayer) {
    warning(self.urlIndex2016 !== undefined, 'The layer has no urlIndex2016.')
  }

  self.urlIndex2016BaseLayer = options.urlIndex2016BaseLayer
  if (self.isBaseLayer) {
    warning(self.urlIndex2016BaseLayer !== undefined, 'The layer has no urlIndex2016BaseLayer.')
  }

  self.layer = options.layer
  warning(self.layer, 'The layer has no layer object.')

  self.additionalSetup = options.additionalSetup
  self.additionalTab = options.additionalTab

  self.isInteractive = false || options.isInteractive

  self.additionalControls = options.additionalControls
  return self
}

import { PropTypes } from 'react'
import TabType from 'features/tabs'

export const LayerType = PropTypes.shape({
  id: PropTypes.string.required, // index for internal handling
  visibleDefault: PropTypes.bool, // defaults to false
  nameKey: PropTypes.string.isRequired, // nameKey as in index into the translation list

  isBaseLayer: PropTypes.bool, // true if this is an base layer; defaults to false

  urlIndex2013: PropTypes.number, // index in url 2013 style
  urlIndex2016: PropTypes.number, // index in url 2016 style (only for overlay layers)
  urlIndex2016BaseLayer: PropTypes.string, // index letter for a base layer (required if isBaseLayer)

  layer: PropTypes.object.isRequired, // ol.layer subclass

  isInteractive: PropTypes.bool, // true if this layer can handle interactions like click and hover

  additionalSetup: PropTypes.node, // a node to be displayed at the layer config
  additionalTab: TabType
})
