/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict'

import React from 'react'
import { FormattedMessage } from 'react-intl'
import {TabSidebarDetails} from 'features/tabs'

import ol from 'openlayers'
import ChartLayer from '../chartlayer'

import OverpassApi from 'ol-source-overpassApi'

import { featureClicked, layerTileLoadStateChange } from '../../store/actions'
import { setSidebarOpen, setSidebarActiveTab } from '../../controls/sidebar/store'

const FEATURE_CLICKED_PROPERTY_NAME = '_clicked'
const FEATURE_HOVERED_PROPERTY_NAME = '_hovered'

module.exports = function (context, options) {
  var defaults = {
    nameKey: 'layer-name-seamarks-debug'
  }
  Object.assign(defaults, options)

  var styleFunction = function (feature, resolution) {
    if (!feature.get('seamark:type')) {
      return null // do not display such things
    }
    let clicked = feature.get(FEATURE_CLICKED_PROPERTY_NAME)
    let hovered = feature.get(FEATURE_HOVERED_PROPERTY_NAME)

    let name = feature.get('seamark:name') || feature.get('name')
    let nameElement = new ol.style.Text({
      font: hovered ? 'bold 12px sans-serif' : '10px sans-serif',
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
        width: hovered || clicked ? 3 : 1
      })
    })

    return new ol.style.Style({
      image: image,
      text: nameElement
    })
  }

  let source = new OverpassApi('(node["seamark:type"](bbox););out body qt;')
  source.on(['tileloadstart', 'tileloadend', 'tileloaderror'], function (ev) {
    context.dispatch(layerTileLoadStateChange(options.id, ev))
  })

  let layer = new ol.layer.Vector({
    source: source,
    style: function (feature, resolution) {
      return styleFunction(feature, resolution, 'normal')
    }
  })

  layer.on('selectFeature', function (e) {
    let feature = e.feature
    feature.set(FEATURE_CLICKED_PROPERTY_NAME, true)
    context.dispatch(featureClicked(feature))
    context.dispatch(setSidebarActiveTab(TabSidebarDetails.name))
    context.dispatch(setSidebarOpen(true))
  })
  layer.on('unselectFeature', function (e) {
    e.feature.set(FEATURE_CLICKED_PROPERTY_NAME, false)
  })

  layer.on('hoverFeature', function (e) {
    let feature = e.feature
    feature.set(FEATURE_HOVERED_PROPERTY_NAME, true)
  })
  layer.on('unhoverFeature', function (e) {
    e.feature.set(FEATURE_HOVERED_PROPERTY_NAME, false)
  })

  var objects = {
    layer: layer,
    isInteractive: true,
    additionalSetup: (
      <div>
        <FormattedMessage id='click-on-markers' />
      </div>
    ),
    additionalTab: TabSidebarDetails
  }

  return new ChartLayer(context, Object.assign(defaults, objects))
}
