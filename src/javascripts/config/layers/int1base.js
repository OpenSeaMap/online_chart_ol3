/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict';

import ol from 'openlayers'
import ChartLayer from '../chartlayer'

var projection = ol.proj.get('EPSG:3857');
var projectionExtent = projection.getExtent();

// The tile size supported by the OSM tile service.
var tileSize = 256;

// Calculate the resolutions supported by the OSM tile service.
// There are 16 resolutions, with a factor of 2 between successive
// resolutions. The max resolution is such that the world (360°)
// fits into two (512x512 px) tiles.
var maxResolution = ol.extent.getWidth(projectionExtent) / (tileSize);
var zoomLevels = 20;
var resolutions = new Array(zoomLevels);
for (var z = 0; z < zoomLevels; ++z) {
  resolutions[z] = maxResolution / Math.pow(2, z);
}

module.exports = function(context, options) {
  var defaults = {
    nameKey: 'layer-name-int1_base',
    layer: new ol.layer.Group({
      opacity: 0.5,
      layers: [
        new ol.layer.Tile({
          //          maxResolution: 2500,
          source: new ol.source.TileImage({
            tileUrlFunction: function(tileCoord /*, pixelRatio, projection*/ ) {
              var z = tileCoord[0];
              var x = tileCoord[1];
              var y = -tileCoord[2] - 1;
              // wrap the world on the X axis
              var n = Math.pow(2, z + 1); // 2 tiles at z=0
              x = x % n;
              if (x * n < 0) {
                // x and n differ in sign so add n to wrap the result
                // to the correct sign
                x = x + n;
              }
              var urlTemplateZ6 = '//tiles.openseamap.org/int1base/Z6-8/{x}/{y}.svgz';
              var urlTemplateZ9 = '//tiles.openseamap.org/int1base/Z9-11/{x}/{y}.svgz';
              var urlTemplateZ12 = '//tiles.openseamap.org/int1base/Z12-18/{x}/{y}.svgz';
              var temp;
              if (z >= 12) {
                temp = urlTemplateZ12;
              } else if (z >= 9) {
                temp = urlTemplateZ9;
              } else {
                temp = urlTemplateZ6;
              }
              return temp
                .replace('{z}', z.toString())
                .replace('{y}', y.toString())
                .replace('{x}', x.toString());
            },
            crossOrigin: 'Anonymous',
            projection: projection,
            tileGrid: new ol.tilegrid.TileGrid({
              origin: ol.extent.getTopLeft(projectionExtent),
              resolutions: resolutions,
              //zoomlevel 0, 1,  2,  3,  4,   5,   6,   7,    8,   9,  10,   11,  12,  13,   14,   15,   16,   17,    18,    19
              tileSizes: [4, 8, 16, 32, 64, 128, 256, 512, 1024, 256, 512, 1024, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768]
            })
          })
        })
      ]
    })
  };
  return new ChartLayer(context, Object.assign(defaults, options));
};
