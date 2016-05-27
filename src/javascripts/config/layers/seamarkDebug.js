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

  var styleFunction = function(feature, resolution, type) {
    if(!feature.get('seamark:type'))
      return null; // do not display such things

    let name = feature.get('seamark:name') || feature.get('name');
    let nameElement = new ol.style.Text({
      font: type === 'hovered' ? 'bold 12px sans-serif' : '10px sans-serif',
      offsetY: 12,
      text: name,
      textAlign: 'center',
      textBaseline: 'top'
    })

    let image = new ol.style.Circle({
      radius: 10,
      fill: new ol.style.Fill({
        color: 'rgba(16, 40, 68, 0.3)'
      }),
      stroke: new ol.style.Stroke({
        color: 'rgba(16, 40, 68, 1)',
        width: type === 'hovered' ? 3 : 1
      })
    })

    return new ol.style.Style({
      image: image,
      text: nameElement
    });
  };

  var selector = new ol.interaction.Select({
    style: function(feature, resolution) {
      return styleFunction(feature, resolution, 'clicked');
    }
  });
  var hoverer = new ol.interaction.Select({
    condition: ol.events.condition.pointerMove,
    style: function(feature, resolution) {
      return styleFunction(feature, resolution, 'hovered');
    }
  });

  selector.on('select', function(e) {
    var feature = e.selected[0];
    if (feature) {
      context.dispatch(featureClicked(feature));
      context.dispatch(setSidebarActiveTab('sidebar-details'));
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
