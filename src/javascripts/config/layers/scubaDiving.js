/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict'

import React from 'react'
import ol from 'openlayers'
import ChartLayer from '../chartlayer'
import { ClickOnMarkersMessage } from 'utils'
import {TabSidebarDetails} from 'features/tabs'
import controlIds from '../../controls/ol3/controls'

var SimpleImageStyle = require('ol-style-simpleImageStyle')
var OverpassApi = require('ol-source-overpassApi')

import { featureClicked, layerTileLoadStateChange } from '../../store/actions'
import { setSidebarOpen, setSidebarActiveTab } from '../../controls/sidebar/store'

import { defineMessages } from 'react-intl'
export const messages = defineMessages({
  layerName: {
    id: 'layer-name-scuba_diving',
    defaultMessage: 'POIs for scuba diving'
  }
})

const FEATURE_CLICKED_PROPERTY_NAME = '_clicked'

module.exports = function (context, options) {
  var defaults = {
    nameKey: 'layer-name-scuba_diving',
    iconSize: 32
  }
  Object.assign(defaults, options)

  var styles = {
    'sport': {
      'scuba_diving': new SimpleImageStyle('images/sport-scuba_diving.svg', defaults.iconSize, defaults.iconSize)
    },
    'amenity': {
      'dive_centre': new SimpleImageStyle('images/amenity-dive_centre.svg', defaults.iconSize, defaults.iconSize)
    }
  }
  let tagBasedStyle = (feature) => {
    for (var key in styles) {
      var value = feature.get(key)
      if (value !== undefined) {
        for (var regexp in styles[key]) {
          if (new RegExp(regexp).test(value)) {
            return styles[key][regexp]
          }
        }
      }
    }
  }

  let markerIcon = new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 1],
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
      opacity: 1,
      src: '//nominatim.openstreetmap.org/js/images/marker-icon.png'
    })
  })

  var styleFunction = function (feature, resolution) {
    let clicked = feature.get(FEATURE_CLICKED_PROPERTY_NAME)

    let baseStyle = tagBasedStyle(feature)

    if (clicked) {
      return [baseStyle, markerIcon]
    }

    return baseStyle
  }

  let source = new OverpassApi('(node[sport=scuba_diving](bbox);node[amenity=dive_centre](bbox););out body qt;')
  source.on(['tileloadstart', 'tileloadend', 'tileloaderror'], function (ev) {
    context.dispatch(layerTileLoadStateChange(options.id, ev))
  })

  let layer = new ol.layer.Vector({
    source: source,
    style: styleFunction
  })

  layer.on('selectFeature', function (e) {
    let feature = e.feature
    feature.set(FEATURE_CLICKED_PROPERTY_NAME, true)
    context.dispatch(featureClicked(feature.getProperties()))
    context.dispatch(setSidebarActiveTab(TabSidebarDetails.name))
    context.dispatch(setSidebarOpen(true))
  })
  layer.on('unselectFeature', function (e) {
    e.feature.set(FEATURE_CLICKED_PROPERTY_NAME, false)
  })

  var objects = {
    layer: layer,

    isInteractive: true,

    additionalSetup: (
      <div>
        <ClickOnMarkersMessage />
      </div>
    ),
    additionalTab: TabSidebarDetails,
    additionalControls: [controlIds.attribution]
  }

  return new ChartLayer(context, Object.assign(defaults, objects))
}
