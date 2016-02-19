'use strict';

// action types
export const SET_LAYER_VISIBLE = 'SET_LAYER_VISIBLE';
export const INIT_LAYER_VISIBLE = 'INIT_LAYER_VISIBLE';

// action creators
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
