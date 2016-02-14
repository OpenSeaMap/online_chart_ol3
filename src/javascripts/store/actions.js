'use strict';

// action types
export const SET_LAYER_VISIBLE = 'SET_LAYER_VISIBLE';

// action creators
export function setLayerVisible(index, visible){
  return {
    type: SET_LAYER_VISIBLE,
    index: index,
    visible: visible
  }
}
