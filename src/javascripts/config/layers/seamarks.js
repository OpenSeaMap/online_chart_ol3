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
    id: 'layer-name-seamarks',
    defaultMessage: 'OpenSeaMap seamarks'
  }
})

module.exports = function (context, options) {
  let source = new ol.source.OSM({
    url: '//t1.openseamap.org/seamark/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous'
  })

  source.on(['tileloadstart', 'tileloadend', 'tileloaderror'], function (ev) {
    context.dispatch(layerTileLoadStateChange(options.id, ev))
  })

  var defaults = {
    nameKey: 'layer-name-seamarks',
    layer: new ol.layer.Tile({
      source: source
    }),
    additionalControls: [controlIds.scaleline_nautical, controlIds.attribution]
  }
  return new ChartLayer(context, Object.assign(defaults, options))
}
