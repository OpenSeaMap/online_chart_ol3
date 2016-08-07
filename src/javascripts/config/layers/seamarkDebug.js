/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict';

import React from 'react'
import { FormattedMessage } from 'react-intl';
import {TabSidebarDetails} from 'features/tabs'

import ol from 'openlayers'
import ChartLayer from '../chartlayer'

import OverpassApi from 'ol-source-overpassApi'

import { featureClicked, layerTileLoadStateChange } from '../../store/actions'
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

  let source = new OverpassApi('(node["seamark:type"](bbox););out body qt;');
  source.on(['tileloadstart', 'tileloadend', 'tileloaderror'], function(ev) {
    context.dispatch(layerTileLoadStateChange(options.id, ev));
  });

  let layer = new ol.layer.Vector({
    source: source,
    style: function(feature, resolution) {
      return styleFunction(feature, resolution, 'normal');
    }
  })

  var selector = new ol.interaction.Select({
    layers: [layer],
    style: function(feature, resolution) {
      return styleFunction(feature, resolution, 'clicked');
    }
  });
  var hoverer = new ol.interaction.Select({
    layers: [layer],
    condition: ol.events.condition.pointerMove,
    style: function(feature, resolution) {
      return styleFunction(feature, resolution, 'hovered');
    }
  });

  selector.on('select', function(e) {
    var feature = e.selected[0];
    if (feature) {
      context.dispatch(featureClicked(feature));
      context.dispatch(setSidebarActiveTab(TabSidebarDetails.name));
      context.dispatch(setSidebarOpen(true));
    }
    return true
  });

  var objects = {
    layer: layer,

    interactions: [
      selector, hoverer
    ],

    additionalSetup: (
      <div>
        <FormattedMessage id="click-on-markers" />
      </div>
    ), additionalTab: TabSidebarDetails
  };


  return new ChartLayer(context, Object.assign(defaults, objects));
};
