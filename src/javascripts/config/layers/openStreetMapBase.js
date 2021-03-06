/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict'

import ol from 'openlayers'
import ChartLayer from '../chartlayer'
import { layerTileLoadStateChange } from '../../store/actions'
import controlIds from '../../controls/ol3/controls'
import orderIds from '../layerOrderNumbers'

import { defineMessages } from 'react-intl'
export const messages = defineMessages({
  layerName: {
    id: 'layer-name-openstreetmap-base',
    defaultMessage: 'OpenStreetMap carto'
  }
})

module.exports = function (context, options) {
  let source = new ol.source.OSM({
    url: '//{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
//    url: '//mapproxy.195.37.132.70.xip.io/tiles/1.0.0/osm/osm_grid/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous'
  })
  source.on(['tileloadstart', 'tileloadend', 'tileloaderror'], function (ev) {
    context.dispatch(layerTileLoadStateChange(options.id, ev))
  })

  var defaults = {
    nameKey: 'layer-name-openstreetmap-base',
    layer: new ol.layer.Tile({
      preload: 6,
      source: source,
      zIndex: orderIds.earth
    }),
    additionalControls: [controlIds.attribution]
  }
  return new ChartLayer(context, Object.assign(defaults, options))
}
