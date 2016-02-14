'use strict';
var $ = require('jquery');
var ol = require('openlayers');

var ChartLayer = require('chartlayer');

module.exports = function(context, options) {
  var defaults = {
    name: 'OpenSeaMap seamarks',
    layer: new ol.layer.Tile({
      source: new ol.source.OSM({
        url: 'http://t1.openseamap.org/seamark/{z}/{x}/{y}.png'
      })
    })
  };
  return new ChartLayer(context, $.extend(defaults, options));
};
