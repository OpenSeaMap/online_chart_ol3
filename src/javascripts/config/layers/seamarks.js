'use strict';

var ol = require('openlayers');

var ChartLayer = require('chartlayer');

module.exports = function(context, options) {
  var defaults = {
    nameKey: 'layer-name-seamarks',
    layer: new ol.layer.Tile({
      source: new ol.source.OSM({
        url: 'http://t1.openseamap.org/seamark/{z}/{x}/{y}.png',
        crossOrigin: 'Anonymous'
      })
    })
  };
  return new ChartLayer(context, Object.assign(defaults, options));
};
