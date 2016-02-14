
import Seamarks from './layers/seamarks'

var ol = require('openlayers');
const layers = [
  {
    layer: new ol.layer.Tile({
      source: new ol.source.OSM({
        url: 'http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          //          url: 'http://t2.openseamap.org/tiles/base/{z}/{x}/{y}.png'

          crossOrigin: 'Anonymous'
      })
    })
  },
  new Seamarks()
]

module.exports = layers;
