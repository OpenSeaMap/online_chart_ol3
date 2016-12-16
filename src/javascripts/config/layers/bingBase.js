/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict'

import ol from 'openlayers'
import ChartLayer from '../chartlayer'
import { layerTileLoadStateChange } from '../../store/actions'
import controlIds from '../../controls/ol3/controls'

import { defineMessages } from 'react-intl'
export const messages = defineMessages({
  layerName: {
    id: 'layer-name-bing-aerial',
    defaultMessage: 'Bing aerial photos'
  }
})

module.exports = function (context, options) {
  let source = new ol.source.BingMaps({
    key: 'AuA1b41REXrEohfokJjbHgCSp1EmwTcW8PEx_miJUvZERC0kbRnpotPTzGsPjGqa',
    imagerySet: 'Aerial',
    maxZoom: 19,
    crossOrigin: 'Anonymous'
  })
  source.on(['tileloadstart', 'tileloadend', 'tileloaderror'], function (ev) {
    context.dispatch(layerTileLoadStateChange(options.id, ev))
  })

  var defaults = {
    nameKey: 'layer-name-bing-aerial',
    layer: new ol.layer.Tile({
      preload: 6,
      source: source
    }),
    additionalControls: [controlIds.attribution]
  }
  return new ChartLayer(context, Object.assign(defaults, options))
}
