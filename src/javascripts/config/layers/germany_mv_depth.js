/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict';

import ol from 'openlayers'
import ChartLayer from 'chartlayer'

module.exports = function(context, options) {
  var defaults = {
    nameKey: 'layer-name-depth-geodaten_mv',
    layer: new ol.layer.Tile({
      source: new ol.source.TileWMS({
        url: 'http://www.geodaten-mv.de/dienste/tiefenkarten_seen_wms?lang=ger&',
        params: {
          'LAYERS': 'tiefenlinien,uferlinien',
          'TILED': true
        },
        gutter: 5
      })
    })
  };
  return new ChartLayer(context, Object.assign(defaults, options));
};
