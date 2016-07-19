/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict';
var ol = require('openlayers');
var $ = require('jquery');

module.exports = function(query) {
  var vectorSource = new ol.source.Vector({
    format: new ol.format.OSMXML(),
    loader: function(extent, resolution, projection) {
      var epsg4326Extent = ol.proj.transformExtent(extent, projection, 'EPSG:4326');
      var baseUrl = 'http://overpass-api.de/api/interpreter?';
      var queryComplete = 'data=' + encodeURIComponent(query) + '&bbox=' + epsg4326Extent.join(',');
      var url =  baseUrl + queryComplete;

      $.ajax({
        url: url,
        success: function(data) {
          let format = this.getFormat()
          let features = format.readFeatures(data, {featureProjection: projection})
          this.addFeatures(features);
          this.dispatchEvent({type: 'tileloadend', target: this})
        },
        error: function(jqXHR, textStatus, errorThrown) {
          this.dispatchEvent({
            type: 'tileloaderror',
            target: this,
            textStatus: textStatus,
            errorThrown: errorThrown
          })
        },
        context: this
      });
      this.dispatchEvent({type: 'tileloadstart', target: this})
    },
    strategy: ol.loadingstrategy.bbox
  });
  return vectorSource;
};
