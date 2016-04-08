/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict';

export const SET_LAYER_VISIBLE = 'SET_LAYER_VISIBLE';
export const INIT_LAYER_VISIBLE = 'INIT_LAYER_VISIBLE';

<<<<<<< a6ae8d94ff818f1a4332b52bcde72fd9e519a247
// action creators
export function setLayerVisible(index, visible) {
=======
export function setLayerVisible(index, visible){
>>>>>>> improve sidebar handling
  return {
    type: SET_LAYER_VISIBLE,
    index: index,
    visible: visible
  }
}
export function initLayerVisible(visibleList) {
  return {
    type: INIT_LAYER_VISIBLE,
    list: visibleList
  }
}

<<<<<<< a6ae8d94ff818f1a4332b52bcde72fd9e519a247
export function setViewPosition(position) {
=======
export const SET_VIEW_POSITION = 'SET_VIEW_POSITION';

export function setViewPosition(position){
>>>>>>> improve sidebar handling
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
