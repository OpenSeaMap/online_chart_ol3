/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict';
var ol = require('openlayers');

module.exports = function(query) {
  var vectorSource = new ol.source.Vector({
    format: new ol.format.OSMXML(),
    url: function(extent, resolution, projection) {
      var epsg4326Extent = ol.proj.transformExtent(extent, projection, 'EPSG:4326');
      var baseUrl = 'http://overpass-api.de/api/interpreter?';
      var queryComplete = 'data=' + encodeURIComponent(query) + '&bbox=' + epsg4326Extent.join(',');
      return baseUrl + queryComplete;
    },
    strategy: ol.loadingstrategy.bbox
  });
  return vectorSource;
};
