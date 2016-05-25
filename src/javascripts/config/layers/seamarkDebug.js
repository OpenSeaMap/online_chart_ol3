/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict';

import ol from 'openlayers'
import ChartLayer from '../chartlayer'

var OverpassApi = require('ol-source-overpassApi');

import { featureClicked } from '../../store/actions'
import { setSidebarOpen, setSidebarActiveTab } from '../../controls/sidebar/store'

module.exports = function(context, options) {

  var defaults = {
    nameKey: 'layer-name-seamarks-debug'
  };
  Object.assign(defaults, options);

  var styles = {
    'seamark:type': {
      '.*': new ol.style.Style({
        image: new ol.style.Circle({
          radius: 10,
          fill: new ol.style.Fill({
            color: 'rgba(246, 99, 79, 0.3)'
          }),
          stroke: new ol.style.Stroke({
            color: 'rgba(246, 99, 79, 1.0)',
            width: 1
          })
        })
      })
    }
  };

  var styleFunction = function(feature, resolution, type) {
    if (type === 'normal' || type === 'hovered' || type === 'clicked') {
      for (var key in styles) {
        var value = feature.get(key);
        if (value !== undefined) {
          for (var regexp in styles[key]) {
            if (new RegExp(regexp).test(value)) {
              return styles[key][regexp];
            }
          }
        }
      }
    }
    return null;
  };

  var selector = new ol.interaction.Select({
    style: function(feature, resolution) {
      return styleFunction(feature, resolution, 'hovered');
    }
  });
  var hoverer = new ol.interaction.Select({
    condition: ol.events.condition.pointerMove,
    style: function(feature, resolution) {
      return styleFunction(feature, resolution, 'clicked');
    }
  });

  selector.on('select', function(e) {
    var feature = e.selected[0];
    if (feature) {
      context.dispatch(featureClicked(feature));
      context.dispatch(setSidebarActiveTab('tagDetails'));
      context.dispatch(setSidebarOpen(true));
    }
  });
/*
  hoverer.on('select', function(e) {
    var selected = e.target.getFeatures().getLength();
    var map = context.map();
    map.mapTargetJ().css('cursor', selected > 0 ? 'pointer' : '');

    var feature = e.selected[0];
    if (feature) {
      context.taginfo().render(feature);
    }
  });*/


  var objects = {
    layer: new ol.layer.Vector({
      source: new OverpassApi('(node["seamark:type"](bbox););out body qt;'),
      style: function(feature, resolution) {
        return styleFunction(feature, resolution, 'normal');
      }
    }),

    interactions: [
      selector, hoverer
    ]
  };


  return new ChartLayer(context, Object.assign(defaults, objects));
};
