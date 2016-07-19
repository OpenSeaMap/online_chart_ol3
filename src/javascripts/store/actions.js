/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict';

export const SET_LAYER_VISIBLE = 'SET_LAYER_VISIBLE';

export const INIT_LAYER_VISIBLE = 'INIT_LAYER_VISIBLE';
export function setLayerVisible(id, visible) {
  return {
    type: SET_LAYER_VISIBLE,
    id: id,
    visible: visible
  }
}
export function initLayerVisible(visibleList) {
  return {
    type: INIT_LAYER_VISIBLE,
    list: visibleList
  }
}

export const SET_VIEW_POSITION = 'SET_VIEW_POSITION';
export function setViewPosition(position) {
  return {
    type: SET_VIEW_POSITION,
    position: position
  }
}

export const FEATURE_CLICKED = 'FEATURE_CLICKED';
export function featureClicked(feature) {
  return {
    type: FEATURE_CLICKED,
    feature: feature
  }
}

export const LAYER_TILE_LOAD_CHANGE = 'LAYER_TILE_LOAD_CHANGE';
// loadEvent is of type ol.source.ImageEvent or ol.source.TileEvent
export function layerTileLoadStateChange(id, loadEvent) {
  return {
    type: LAYER_TILE_LOAD_CHANGE,
    id: id,
    changeType: loadEvent.type
  }
}
