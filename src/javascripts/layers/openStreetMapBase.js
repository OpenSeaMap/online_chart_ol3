'use strict';

var ol = require('openlayers');
var $ = require('jquery');

var ChartLayer = require('chartlayer');

module.exports = function(context, options) {
  var defaults = {
    name: 'OpenStreetMap base map',
    layer: new ol.layer.Tile({
      source: new ol.source.OSM({
        url: 'http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          //          url: 'http://t2.openseamap.org/tiles/base/{z}/{x}/{y}.png'
      })
    })
  };
  return new ChartLayer(context, $.extend(defaults, options));
};
