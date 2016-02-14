'use strict';

var ol = require('openlayers');

var ChartLayer = require('chartlayer');

module.exports = function(context, options) {
  var defaults = {
    nameKey: 'layer-name-openstreetmap-base',
    layer: new ol.layer.Tile({
      source: new ol.source.OSM({
        url: 'http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          //          url: 'http://t2.openseamap.org/tiles/base/{z}/{x}/{y}.png'

          crossOrigin: 'Anonymous'
      })
    })
  };
  return new ChartLayer(context, Object.assign(defaults, options));
};
