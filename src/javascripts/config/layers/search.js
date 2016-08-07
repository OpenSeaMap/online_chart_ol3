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
  searchResultClicked,
  searchResultUnclick
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

export const SearchTab = {
    name: 'sidebar-search',
    align: 'top',
    icon: < MdSearch / > ,
    content: < SearchTabComponent / >
};

module.exports = function(context, options) {
  var defaults = {
      nameKey: 'layer-name-search'
  };
  Object.assign(defaults, options);

  var styleFunction = function(/*resolution*/) {
    let feature = this
    return [
      new ol.style.Style({
        geometry: 'geometry',
        stroke: new ol.style.Stroke({
            color: feature.get('clicked') ? 'red': 'blue',
          lineDash: [4],
          width: 3
        }),
        fill: new ol.style.Fill({
          color: 'rgba(0, 0, 255, 0.1)'
        })
      }),
      new ol.style.Style({
        geometry: 'labelPoint',
        image: new ol.style.Icon({
          src: feature.get('icon')
        }),
        text: new ol.style.Text({
          font: feature.get('hovered') ? 'bold 12px sans-serif' : '10px sans-serif',
          offsetY: 12,
          text: feature.get('display_name'),
          textAlign: 'center',
          textBaseline: 'top'
        })
      }),
    ]
  };

  var vectorSource = new ol.source.Vector({
    projection: 'EPSG:3857'
  });


  let oldSearchState = context.getState().search.state
  let searchHandler = function() {
      let state = context.getState()

      let hoveredFeature = state.search.hoveredFeature
      if(hoveredFeature)
        hoveredFeature.set('hovered', true)
      let clickedFeature = state.search.clickedFeature
      if(clickedFeature)
        clickedFeature.set('clicked', true)

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
          vectorSource.addFeature(feature);
      })
  }
  context.subscribe(searchHandler)

  let layer = new ol.layer.Vector({
      source: vectorSource
  })

  var selector = new ol.interaction.Select({
      layers: [layer]
  });
  selector.on('select', function(e) {
    e.deselected.forEach((feature) => {
      feature.set('clicked', false)
    })

    var feature = e.selected[0];
    if (feature) {
      context.dispatch(searchResultClicked(feature));
      context.dispatch(setSidebarActiveTab(SearchTab.name));
      context.dispatch(setSidebarOpen(true));
    } else {
      context.dispatch(searchResultUnclick())
    }
    return true
  });

  var hoverer = new ol.interaction.Select({
      layers: [layer],
      condition: ol.events.condition.pointerMove
  });
  hoverer.on('select', function(e) {
    e.deselected.forEach((feature) => {
      feature.set('hovered', false)
    })

    var feature = e.selected[0];
    if (feature) {
      context.dispatch(searchResultHovered(feature));
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
