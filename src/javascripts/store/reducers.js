/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
import { combineReducers, createStore, compose, applyMiddleware } from 'redux'
import { SET_LAYER_VISIBLE, INIT_LAYER_VISIBLE, SET_VIEW_POSITION, FEATURE_CLICKED} from './actions'

function layerVisible(state = {}, action) {
  switch (action.type) {
    case SET_LAYER_VISIBLE:
      let visi = {};
      visi[action.index] = action.visible;
      return Object.assign({}, state, visi);

    case INIT_LAYER_VISIBLE:
      return Object.assign({}, action.list);

    default:
      return state;
  }
}

function viewPosition(state = {}, action) {
  switch (action.type) {
    case SET_VIEW_POSITION:
      return Object.assign({}, state, action.position);

    default:
      return state;
  }
}

function selectedFeature(state = {
    hasFeature: false
  }, action) {
  switch (action.type) {
    case FEATURE_CLICKED:
      return {
        hasFeature: true,
        feature: action.feature
      }
    default:
      return state;
  }
}

const mapApp = combineReducers({
  layerVisible,
  viewPosition,
  selectedFeature
})

import { writeToUrlHash } from './urlHashHandling'

export default function configureStore(initialState) {
  const store = createStore(mapApp, initialState, compose(
    applyMiddleware(writeToUrlHash),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ));

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
