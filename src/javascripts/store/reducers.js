/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
import { combineReducers, createStore, compose, applyMiddleware } from 'redux'
import { SET_LAYER_VISIBLE, INIT_LAYER_VISIBLE, SET_VIEW_POSITION, FEATURE_CLICKED, LAYER_TILE_LOAD_CHANGE } from './actions'

import { sidebarIsOpen, sidebarSelectedTab } from '../controls/sidebar/store'

function layerVisible(state = {}, action) {
  switch (action.type) {
    case SET_LAYER_VISIBLE:
      var vis = {};
      vis[action.id] = action.visible;
      return Object.assign({}, state, vis);

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

function layerTileLoadState(state = {}, action){
  switch (action.type) {
    case LAYER_TILE_LOAD_CHANGE: {
      let count = state[action.id];

      if(action.changeType === 'imageloadstart' || action.changeType === 'tileloadstart') {
        count.loading++;
      } else {
        count.loaded++;
      }

      if(action.changeType.endsWith('error')) {
        count.lastError = action.changeType
      }

      if(count.loading == count.loaded) {
         count.loading = 0
         count.loaded = 0
      }

      let obj = {};
      obj[action.id] = count;
      return Object.assign({}, state, obj);
    }

    case SET_LAYER_VISIBLE: {
      let count = state[action.id];
      count.lastError = ''
      let obj = {};
      obj[action.id] = count;
      return Object.assign({}, state, obj);
    }

    case INIT_LAYER_VISIBLE: {
      let obj = {};
      Object.keys(action.list).forEach(id => {
        obj[id] =  {
          lastError: '',
          loading: 0,
          loaded: 0
        }
      })
      return Object.assign({}, obj);
    }
    default:
      return state;
  }
}

const mapApp = combineReducers({
  sidebarIsOpen,
  sidebarSelectedTab,
  layerVisible,
  viewPosition,
  selectedFeature,
  layerTileLoadState
})

import { writeToUrlHash } from './urlHashHandling'

export default function configureStore(initialState) {
  const store = createStore(mapApp, initialState, compose(
    applyMiddleware(writeToUrlHash),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ));

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
