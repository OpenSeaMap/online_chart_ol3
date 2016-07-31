/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict';

import React from 'react'
import ol from 'openlayers'
import ChartLayer from '../chartlayer'
import { FormattedMessage } from 'react-intl';
import {TabSidebarDetails} from 'features/tabs'

var SimpleImageStyle = require('ol-style-simpleImageStyle');
var OverpassApi = require('ol-source-overpassApi');

import { featureClicked, layerTileLoadStateChange } from '../../store/actions'
import { setSidebarOpen, setSidebarActiveTab } from '../../controls/sidebar/store'

module.exports = function(context, options) {

  var defaults = {
    nameKey: 'layer-name-scuba_diving',
    iconSize: 32
  };
  Object.assign(defaults, options);

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

  selector.on('select', function(e) {
    var feature = e.selected[0];
    if (feature) {
      context.dispatch(featureClicked(feature));
      context.dispatch(setSidebarActiveTab(TabSidebarDetails.name));
      context.dispatch(setSidebarOpen(true));
    }
  });

  let source = new OverpassApi('(node[sport=scuba_diving](bbox);node[amenity=dive_centre](bbox););out body qt;');
  source.on(['tileloadstart', 'tileloadend', 'tileloaderror'], function(ev) {
    context.dispatch(layerTileLoadStateChange(options.id, ev));
  });

  var objects = {
    layer: new ol.layer.Vector({
      source: source,
      style: function(feature, resolution) {
        return styleFunction(feature, resolution, 'normal');
      }
    }),

    interactions: [
      selector, hoverer
    ],

    additionalSetup: (
      <div>
        <FormattedMessage id="click-on-markers" />
      </div>
    ),
    additionalTab: TabSidebarDetails
  };


  return new ChartLayer(context, Object.assign(defaults, objects));
};
