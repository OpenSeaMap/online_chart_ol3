/**
 * @license AGPL-3.0
 * @author aAXEe (https://github.com/aAXEe)
 */
'use strict';

import React from 'react'
import _ from 'lodash'

import SearchTabComponent from 'features/search/searchTab'
import SearchBar from 'features/search/searchBar'
import {MdSearch} from 'react-icons/lib/md'

import ol from 'openlayers'
import ChartLayer from '../chartlayer'

import {layerTileLoadStateChange} from '../../store/actions'
import {
  searchResultHovered,
  searchResultUnhover,
  searchResultClicked
} from '../../store/actions'

import {
    setSidebarOpen,
    setSidebarActiveTab
} from '../../controls/sidebar/store'
import {
    SEARCH_STATE_ERROR,
    SEARCH_STATE_RUNNING,
    SEARCH_STATE_COMPLETE
} from 'store/reducers'

import { setViewToExtent } from 'store/actions'

export const SearchTab = {
    name: 'sidebar-search',
    align: 'top',
    icon: < MdSearch / > ,
    content: < SearchTabComponent / >
};

const SEARCH_FEATURE_CLICKED_PROPERTY_NAME = '_clicked'
const SEARCH_FEATURE_HOVERED_PROPERTY_NAME = '_hovered'

module.exports = function(context, options) {
  var defaults = {
      nameKey: 'layer-name-search'
  };
  Object.assign(defaults, options);

  var styleFunction = function(/*resolution*/) {
    let feature = this
    // display label only for hovered or clicked features
    let text = feature.get(SEARCH_FEATURE_HOVERED_PROPERTY_NAME) || feature.get(SEARCH_FEATURE_CLICKED_PROPERTY_NAME)
       ? new ol.style.Text({
         font: feature.get(SEARCH_FEATURE_HOVERED_PROPERTY_NAME) ? 'bold 12px sans-serif' : '10px sans-serif',
         offsetY: 12,
         text: feature.get('display_name'),
         textAlign: 'center',
         textBaseline: 'top'
        })
      : null

    let icon = feature.get('icon')
    ? new ol.style.Icon({
      src: feature.get('icon')
    })
    : new ol.style.Circle({
      stroke: new ol.style.Stroke({
          color: 'blue',
        width: 3
      }),
      fill: new ol.style.Fill({
        color: 'rgba(0, 0, 255, 0.1)'
      })
    })

    return [
      new ol.style.Style({
        geometry: 'geometry',
        stroke: new ol.style.Stroke({
            color: feature.get(SEARCH_FEATURE_CLICKED_PROPERTY_NAME) ? 'red': 'blue',
          lineDash: [4],
          width: 3
        }),
        fill: new ol.style.Fill({
          color: 'rgba(0, 0, 255, 0.1)'
        })
      }),
      new ol.style.Style({
        geometry: 'labelPoint',
        image: icon,
        text: text
      }),
    ]
  };

  var vectorSource = new ol.source.Vector({
    projection: 'EPSG:3857'
  });

  let updateMapPosition = function(feature){
    let bound = feature.get('boundingbox')
    let topLeft = ol.proj.fromLonLat([Number(bound[2]), Number(bound[0])]);
    let bottomRight = ol.proj.fromLonLat([Number(bound[3]), Number(bound[1])]);
    let extent=[topLeft[0], topLeft[1], bottomRight[0], bottomRight[1]]
    context.dispatch(setViewToExtent(extent))
  }

  let oldClickState = context.getState().search.clickedFeatureId
  let clickHandler = function(){
      let state = context.getState()
      if(oldClickState === state.search.clickedFeatureId)
        return
      oldClickState = state.search.clickedFeatureId

      let features = vectorSource.getFeatures();
      features.forEach(feature =>{
        feature.set(SEARCH_FEATURE_CLICKED_PROPERTY_NAME, false)
      })

      if(!state.search.clickedFeatureId) return

      let clickedFeature = vectorSource.getFeatureById(state.search.clickedFeatureId)
      if(!clickedFeature) return

      clickedFeature.set(SEARCH_FEATURE_CLICKED_PROPERTY_NAME, true)
      updateMapPosition(clickedFeature)
  }

  let oldHoverState = context.getState().search.hoveredFeatureId
  let hoverHandler = function(){
      let state = context.getState()
      if(oldHoverState === state.search.hoveredFeatureId)
        return
      oldHoverState = state.search.hoveredFeatureId

      let features = vectorSource.getFeatures();
      features.forEach(feature =>{
        feature.set(SEARCH_FEATURE_HOVERED_PROPERTY_NAME, false)
      })

      if(!state.search.hoveredFeatureId) return

      let hoveredFeature = vectorSource.getFeatureById(state.search.hoveredFeatureId)
      if(!hoveredFeature) return
      hoveredFeature.set(SEARCH_FEATURE_HOVERED_PROPERTY_NAME, true)
  }

  let oldSearchState = context.getState().search.state
  let searchHandler = function() {
      let state = context.getState()
      let searchState = state.search.state
      if (searchState === oldSearchState)
          return
      oldSearchState = searchState

      if (searchState === SEARCH_STATE_RUNNING)
          context.dispatch(layerTileLoadStateChange(options.id, {
              type: 'tileloadstart'
          }));
      if (searchState === SEARCH_STATE_COMPLETE)
          context.dispatch(layerTileLoadStateChange(options.id, {
              type: 'tileloadend'
          }));
      if (searchState === SEARCH_STATE_ERROR)
          context.dispatch(layerTileLoadStateChange(options.id, {
              type: 'tileloaderror'
          }));

      vectorSource.clear()

      if (searchState !== SEARCH_STATE_COMPLETE)
          return

      let results = state.search.response
      results.forEach((res) => {
          let geoJson = res.geojson
          let geom = new ol.format.GeoJSON().readGeometry(geoJson, {featureProjection: 'EPSG:3857'})
          let labelCoords = ol.proj.fromLonLat([Number(res.lon), Number(res.lat)]);

          let featureProps = _.omit(res, ['geojson'])
          featureProps.geometry = geom
          featureProps.labelPoint = new ol.geom.Point(labelCoords)

          let feature = new ol.Feature(featureProps);
          feature.setStyle(styleFunction)
          feature.setId(res.place_id)
          vectorSource.addFeature(feature);
      })
  }
  let storeChangeHandler = function(){
    searchHandler()
    hoverHandler()
    clickHandler()
  }
  context.subscribe(storeChangeHandler)

  let layer = new ol.layer.Vector({
      source: vectorSource
  })

  var selector = new ol.interaction.Select({
      layers: [layer]
  });
  selector.on('select', function(e) {
    var feature = e.selected[0];
    if (feature) {
      context.dispatch(searchResultClicked(feature.getId()));
      context.dispatch(setSidebarActiveTab(SearchTab.name));
      context.dispatch(setSidebarOpen(true));
    }
    return true
  });

  var hoverer = new ol.interaction.Select({
      layers: [layer],
      condition: ol.events.condition.pointerMove
  });
  hoverer.on('select', function(e) {
    var feature = e.selected[0];
    if (feature) {
      context.dispatch(searchResultHovered(feature.getId()));
    } else {
      context.dispatch(searchResultUnhover())
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
          <SearchBar / >
        </div>
      ),
      additionalTab: SearchTab
  };

  return new ChartLayer(context, Object.assign(defaults, objects));
};
