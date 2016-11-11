/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict'

import _ from 'lodash'
import React from 'react'
import ol from 'openlayers'
import ChartLayer from '../chartlayer'
import { FormattedMessage } from 'react-intl'
import MdDownload from 'react-icons/lib/md/file-download'

import DownloadTabControl from 'features/downloadBundles/downloadTab'
import { setSidebarOpen, setSidebarActiveTab } from '../../controls/sidebar/store'

import {
  downloadHovered,
  downloadUnhover,
  downloadClicked,
  downloadUnclick,
  layerTileLoadStateChange,
  downloadSetFeatures,
  downloadFeatureMatchesFilter
} from '../../store/actions'

import { setViewPosition } from 'store/actions'

const FEATURE_CLICKED_PROPERTY_NAME = '_clicked'
const FEATURE_HOVERED_PROPERTY_NAME = '_hovered'
const FEATURE_FILTERED_OUT_PROPERTY_NAME = '_filtered'

export const DownloadTab = {
  name: 'sidebar-download',
  align: 'top',
  icon: < MdDownload / >,
  content: < DownloadTabControl / >
}

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
    const filteredOut = feature.get(FEATURE_FILTERED_OUT_PROPERTY_NAME)
    if (filteredOut) return null

    const clicked = feature.get(FEATURE_CLICKED_PROPERTY_NAME)
    const hovered = feature.get(FEATURE_HOVERED_PROPERTY_NAME)
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
    if (ev.type === 'tileloadend') {
      context.dispatch(downloadSetFeatures(source.getFeatures()))
    }
  })
  source.on('addfeature', (ev) => {
    let features = []
    for (let f of source.getFeatures()) {
      features.push(Object.assign({_id: ol.getUid(f)}, _.omit(f.getProperties(), 'geometry')))
      f.setId(ol.getUid(f))
    }
    context.dispatch(downloadSetFeatures(features))
  })

  let layer = new ol.layer.Vector({
    source: source,
    style: styleFunction,
    updateWhileAnimating: true,
    updateWhileInteracting: true
  })

  layer.on('selectFeature', function (e) {
    let feature = e.feature
    // feature.set(FEATURE_CLICKED_PROPERTY_NAME, true)
    context.dispatch(downloadClicked(feature.getId()))
    context.dispatch(setSidebarActiveTab(DownloadTab.name))
    context.dispatch(setSidebarOpen(true))
  })
  layer.on('unselectFeature', function (e) {
    // e.feature.set(FEATURE_CLICKED_PROPERTY_NAME, false)
    context.dispatch(downloadUnclick())
  })
  layer.on('hoverFeature', function (e) {
    let feature = e.feature
    // feature.set(FEATURE_HOVERED_PROPERTY_NAME, true)
    context.dispatch(downloadHovered(feature.getId()))
  })
  layer.on('unhoverFeature', function (e) {
    // e.feature.set(FEATURE_HOVERED_PROPERTY_NAME, false)
    context.dispatch(downloadUnhover())
  })

  let updateMapPosition = function (feature) {
    context.dispatch(setViewPosition(undefined, feature.getGeometry().getExtent()))
  }

  let oldClickState = context.getState().downloadBundles.clickedFeatureId
  let clickHandler = function () {
    let state = context.getState()
    if (oldClickState === state.downloadBundles.clickedFeatureId) return
    oldClickState = state.downloadBundles.clickedFeatureId

    let features = source.getFeatures()
    features.forEach(feature => {
      feature.set(FEATURE_CLICKED_PROPERTY_NAME, false)
    })

    if (!state.downloadBundles.clickedFeatureId) return

    let clickedFeature = source.getFeatureById(state.downloadBundles.clickedFeatureId)
    if (!clickedFeature) return

    clickedFeature.set(FEATURE_CLICKED_PROPERTY_NAME, true)
    updateMapPosition(clickedFeature)
  }

  let oldHoverState = context.getState().downloadBundles.hoveredFeatureId
  let hoverHandler = function () {
    let state = context.getState()
    if (oldHoverState === state.downloadBundles.hoveredFeatureId) return
    oldHoverState = state.downloadBundles.hoveredFeatureId

    let features = source.getFeatures()
    features.forEach(feature => {
      feature.set(FEATURE_HOVERED_PROPERTY_NAME, false)
    })

    if (!state.downloadBundles.hoveredFeatureId) return

    let hoveredFeature = source.getFeatureById(state.downloadBundles.hoveredFeatureId)
    if (!hoveredFeature) return
    hoveredFeature.set(FEATURE_HOVERED_PROPERTY_NAME, true)
  }

  let oldFilterState = context.getState().downloadBundles.filter
  const filterHandler = function () {
    let state = context.getState()
    if (oldFilterState === state.downloadBundles.filter) return
    oldFilterState = state.downloadBundles.filter

    let features = source.getFeatures()
    features.forEach(feature => {
      const isActive = downloadFeatureMatchesFilter(feature.getProperties(), state.downloadBundles.filter)
      feature.set(FEATURE_FILTERED_OUT_PROPERTY_NAME, !isActive)
    })
  }

  let storeChangeHandler = function () {
    hoverHandler()
    clickHandler()
    filterHandler()
  }
  context.subscribe(storeChangeHandler)

  var objects = {
    layer: layer,
    isInteractive: true,
    additionalSetup: (
      <div>
        <FormattedMessage id='click-on-markers' />
      </div>
    ),
    additionalTab: DownloadTab
  }
  return new ChartLayer(context, Object.assign(defaults, objects))
}
