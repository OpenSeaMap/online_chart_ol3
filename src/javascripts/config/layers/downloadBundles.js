/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict'

import React from 'react'
import ol from 'openlayers'
import ChartLayer from '../chartlayer'
import { FormattedMessage } from 'react-intl'
import {TabSidebarDetails} from 'features/tabs'

import { featureClicked, layerTileLoadStateChange } from '../../store/actions'
import { setSidebarOpen, setSidebarActiveTab } from '../../controls/sidebar/store'

const FEATURE_CLICKED_PROPERTY_NAME = '_clicked'
const FEATURE_HOVERED_PROPERTY_NAME = '_hovered'

module.exports = function (context, options) {
  var defaults = {
    nameKey: 'layer-name-download_bundles'
  }
  Object.assign(defaults, options)

  const textStrokeStyle = new ol.style.Stroke({color: 'rgba(255,255,255,0.8)', width: 2})
  const textFillStyle = new ol.style.Fill({color: '#222'})
  const defaultPolygonFill = new ol.style.Fill({
    color: 'rgba(255, 100, 0, 0.3)'
  })
  const defaultPolygonStroke = new ol.style.Stroke({
    color: '#f60',
    width: 1
  })
  const clickedPolygonFill = new ol.style.Fill({
    color: 'rgba(255, 30, 0, 0.3)'
  })
  const clickedPolygonStroke = new ol.style.Stroke({
    color: '#f30',
    width: 2
  })
  const hoveredPolygonStroke = new ol.style.Stroke({
    color: '#f60',
    width: 3
  })

  const styleFunction = function (feature) {
    let clicked = feature.get(FEATURE_CLICKED_PROPERTY_NAME)
    let hovered = feature.get(FEATURE_HOVERED_PROPERTY_NAME)
    let name = feature.get('name')
    let nameElement = new ol.style.Text({
      font: hovered ? 'bold 14px sans-serif' : '14px sans-serif',
      text: name,
      textAlign: 'center',
      textBaseline: 'center',
      stroke: textStrokeStyle,
      fill: textFillStyle
    })

    return new ol.style.Style({
      stroke: clicked ? clickedPolygonStroke : hovered ? hoveredPolygonStroke : defaultPolygonStroke,
      fill: clicked ? clickedPolygonFill : defaultPolygonFill,
      text: nameElement
    })
  }

  let source = new ol.source.Vector({
    url: 'https://t1.openseamap.org/bundles/overview.geojson',
    format: new ol.format.GeoJSON(),
    strategy: ol.loadingstrategy.all
  })
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
