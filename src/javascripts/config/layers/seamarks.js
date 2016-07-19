/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict';

import ol from 'openlayers'
import ChartLayer from '../chartlayer'
import { layerTileLoadStateChange } from '../../store/actions'

module.exports = function(context, options) {
  let source = new ol.source.OSM({
    url: '//t1.openseamap.org/seamark/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous'
  });

  source.on(['tileloadstart', 'tileloadend', 'tileloaderror'], function(ev) {
    context.dispatch(layerTileLoadStateChange(options.id, ev));
  });

  var defaults = {
    nameKey: 'layer-name-seamarks',
    layer: new ol.layer.Tile({
      source: source
    })
  };
  return new ChartLayer(context, Object.assign(defaults, options));
};
