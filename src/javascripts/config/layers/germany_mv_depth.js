/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict';

import ol from 'openlayers'
import ChartLayer from '../chartlayer'
import { layerTileLoadStateChange } from '../../store/actions'

module.exports = function(context, options) {
  let source = new ol.source.TileWMS({
    url: 'http://www.geodaten-mv.de/dienste/tiefenkarten_seen_wms?lang=ger&',
    params: {
      'LAYERS': 'tiefenlinien,uferlinien',
      'TILED': true
    },
    gutter: 0
  })

  source.on(['tileloadstart', 'tileloadend', 'tileloaderror'], function(ev) {
    context.dispatch(layerTileLoadStateChange(options.id, ev));
  });

  var defaults = {
    nameKey: 'layer-name-depth-geodaten_mv',
    layer: new ol.layer.Tile({
      source: source
    })
  };
  return new ChartLayer(context, Object.assign(defaults, options));
};
