/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict'

import ol from 'openlayers'
import ChartLayer from '../chartlayer'

import { defineMessages } from 'react-intl'
export const messages = defineMessages({
  layerName: {
    id: 'layer-name-tileCoordinates',
    defaultMessage: 'Debug tiles'
  }
})

module.exports = function (context, options) {
  var defaults = {
    nameKey: 'layer-name-tileCoordinates',
    layer: new ol.layer.Tile({
      source: new ol.source.TileDebug({
        projection: 'EPSG:3857',
        tileGrid: ol.tilegrid.createXYZ({maxZoom: 22})
      })
    })
  }
  return new ChartLayer(context, Object.assign(defaults, options))
}
