'use strict';
var $ = require('jquery');
var ol = require('openlayers');

var SimpleImageStyle = require('ol-style-simpleImageStyle');
var OverpassApi = require('ol-source-overpassApi');
var ChartLayer = require('chartlayer');

module.exports = function(context, options) {

  var defaults = {
    name: 'Scuba diving',
    iconSize: 32
  };
  $.extend(defaults, options);

  var styles = {
    'sport': {
      'scuba_diving': new SimpleImageStyle('images/sport-scuba_diving.svg', defaults.iconSize, defaults.iconSize)
    },
    'amenity': {
      'dive_centre': new SimpleImageStyle('images/amenity-dive_centre.svg', defaults.iconSize, defaults.iconSize)
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

  function showSidebar(features) {
    var feature = features[0];
    if (feature) {
      context.taginfo().render(feature);
      context.sidebar().open('details');
    } else {
      context.sidebar().close();
    }
  }

  selector.on('select', function(e) {
    showSidebar(e.selected);
  });

  hoverer.on('select', function(e) {
    var selected = e.target.getFeatures().getLength();
    var map = context.map();
    map.mapTargetJ().css('cursor', selected > 0 ? 'pointer' : '');

    var feature = e.selected[0];
    if (feature) {
      context.taginfo().render(feature);
    }
  });


  var objects = {
    layer: new ol.layer.Vector({
      source: new OverpassApi('(node[sport=scuba_diving](bbox);node[amenity=dive_centre](bbox););out body qt;'),
      style: function(feature, resolution) {
        return styleFunction(feature, resolution, 'normal');
      }
    }),

    interactions: [
      selector, hoverer
    ]
  };


  return new ChartLayer(context, $.extend(defaults, objects));
};
