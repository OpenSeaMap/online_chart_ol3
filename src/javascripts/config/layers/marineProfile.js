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
    id: 'layer-name-marineProfile',
    defaultMessage: 'Marine profile'
  }
})

module.exports = function (context, options) {
  let source = new ol.source.TileWMS({
    url: 'http://osm.franken.de:8080/geoserver/gwc/service/wms', // server does not support https :(
    params: {'LAYERS': 'gebco_2014', 'VERSION': '1.1.1'}
  })

  source.on(['tileloadstart', 'tileloadend', 'tileloaderror'], function (ev) {
    context.dispatch(layerTileLoadStateChange(options.id, ev))
  })

  var defaults = {
    nameKey: 'layer-name-marineProfile',
    layer: new ol.layer.Tile({
      source: source,
      opacity: 0.7,
      zIndex: orderIds.user_under_roads
    }),
    additionalControls: [controlIds.scaleline_nautical]
  }
  return new ChartLayer(context, Object.assign(defaults, options))
}
