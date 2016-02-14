
import { combineReducers } from 'redux'

import { SET_LAYER_VISIBLE } from './actions'


function layerVisible(state = {}, action){
  switch(action.type) {
    case SET_LAYER_VISIBLE:
      let visi = {};
      visi[action.index] = {
        visible: action.visible
      };
      return Object.assign({}, state, visi);

    default:
      return state;
  }
}

const mapApp = combineReducers({
  layerVisible
})

export default mapApp
