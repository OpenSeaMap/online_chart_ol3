'use strict';

var ol = require('openlayers');
var $ = require('jquery');

var ChartLayer = require('chartlayer');

module.exports = function(context, options) {
  var defaults = {
    name: 'Int1 basemap',
    layer: new ol.layer.Tile({
      maxResolution: 400,
      source: new ol.source.XYZ({
        url: 'http://t1.openseamap.org/int1base/{x}/{y}.svgz',
        maxZoom: 9,
        crossOrigin: 'Anonymous'
      })
    })
  };
  return new ChartLayer(context, $.extend(defaults, options));
};
