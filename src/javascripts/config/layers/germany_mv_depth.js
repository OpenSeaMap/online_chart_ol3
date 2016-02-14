'use strict';
var $ = require('jquery');
var ol = require('openlayers');

var ChartLayer = require('chartlayer');

module.exports = function(context, options) {
  var defaults = {
    name: 'Germany: Depth data for lakes in MV',
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
  return new ChartLayer(context, $.extend(defaults, options));
};
