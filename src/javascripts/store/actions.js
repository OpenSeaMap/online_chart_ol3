/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict';

export const SET_LAYER_VISIBLE = 'SET_LAYER_VISIBLE';
export const INIT_LAYER_VISIBLE = 'INIT_LAYER_VISIBLE';

export function setLayerVisible(index, visible){
  return {
    type: SET_LAYER_VISIBLE,
    index: index,
    visible: visible
  }
}
export function initLayerVisible(visibleList){
  return {
    type: INIT_LAYER_VISIBLE,
    list: visibleList
  }
}

export const SET_VIEW_POSITION = 'SET_VIEW_POSITION';

export function setViewPosition(position){
  return {
    type: SET_VIEW_POSITION,
    position: position
  }
}


export const FEATURE_CLICKED = 'FEATURE_CLICKED';
export function featureClicked(feature){
  return {
    type: FEATURE_CLICKED,
    feature: feature
  }
}
