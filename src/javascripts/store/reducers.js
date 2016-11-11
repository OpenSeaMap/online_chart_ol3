/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/

import {
    combineReducers,
    createStore,
    compose,
    applyMiddleware
} from 'redux'

import {
    SET_LAYER_VISIBLE,
    INIT_LAYER_VISIBLE,
    SET_VIEW_POSITION,
    FEATURE_CLICKED,
    LAYER_TILE_LOAD_CHANGE,
    SEARCH_START,
    SEARCH_CLEAR,
    SEARCH_END,
    SEARCH_RESULT_HOVERED,
    SEARCH_RESULT_CLICKED,
    DOWNLOAD_SET_FEATURES,
    DOWNLOAD_SET_FILTER,
    DOWNLOAD_HOVERED,
    DOWNLOAD_CLICKED
} from './actions'

import {
    sidebarIsOpen,
    sidebarSelectedTab
} from '../controls/sidebar/store'

function layerVisible (state = {}, action) {
  switch (action.type) {
    case SET_LAYER_VISIBLE:
      var vis = {}
      vis[action.id] = action.visible
      return Object.assign({}, state, vis)

    case INIT_LAYER_VISIBLE:
      return Object.assign({}, action.list)

    default:
      return state
  }
}

function viewPosition (state = {}, action) {
  switch (action.type) {
    case SET_VIEW_POSITION:
      return Object.assign({}, state, {position: action.position, extent: action.extent})

    default:
      return state
  }
}

function selectedFeature (state = {
  hasFeature: false
}, action) {
  switch (action.type) {
    case FEATURE_CLICKED:
      return {
        hasFeature: true,
        feature: action.feature
      }
    default:
      return state
  }
}

function layerTileLoadState (state = {}, action) {
  switch (action.type) {
    case LAYER_TILE_LOAD_CHANGE: {
      let count = state[action.id]

      if (action.changeType === 'imageloadstart' || action.changeType === 'tileloadstart') {
        count.loading++
      } else {
        count.loaded++
      }

      if (action.changeType.endsWith('error')) {
        count.lastError = action.changeType
      }

      if (count.loading === count.loaded) {
        count.loading = 0
        count.loaded = 0
      }

      let obj = {}
      obj[action.id] = count
      return Object.assign({}, state, obj)
    }

    case SET_LAYER_VISIBLE: {
      let count = state[action.id]
      count.lastError = ''
      let obj = {}
      obj[action.id] = count
      return Object.assign({}, state, obj)
    }

    case INIT_LAYER_VISIBLE: {
      let obj = {}
      Object.keys(action.list).forEach(id => {
        obj[id] = {
          lastError: '',
          loading: 0,
          loaded: 0
        }
      })
      return Object.assign({}, obj)
    }
    default:
      return state
  }
}

export const SEARCH_STATE_IDLE = 'SEARCH_STATE_IDLE'
export const SEARCH_STATE_RUNNING = 'SEARCH_STATE_RUNNING'
export const SEARCH_STATE_COMPLETE = 'SEARCH_STATE_COMPLETE'
export const SEARCH_STATE_ERROR = 'SEARCH_STATE_ERROR'

export const SEARCH_STATES = [
  SEARCH_STATE_IDLE,
  SEARCH_STATE_RUNNING,
  SEARCH_STATE_COMPLETE,
  SEARCH_STATE_ERROR
]

const searchDefaultState = {
  state: SEARCH_STATE_IDLE,
  query: '',
  response: [],
  hoveredFeatureId: null,
  clickedFeatureId: null
}

function search (state = searchDefaultState, action) {
  switch (action.type) {
    case SEARCH_START: {
      let obj = {
        state: SEARCH_STATE_RUNNING,
        query: action.query
      }
      return Object.assign({}, searchDefaultState, obj)
    }
    case SEARCH_CLEAR:
      return searchDefaultState

    case SEARCH_END: {
      let obj = {}
      if (action.success) {
        obj.state = SEARCH_STATE_COMPLETE
      } else {
        obj.state = SEARCH_STATE_ERROR
      }
      obj.response = action.response
      return Object.assign({}, state, obj)
    }
    case SEARCH_RESULT_HOVERED: {
      let obj = {
        hoveredFeatureId: action.featureId
      }
      return Object.assign({}, state, obj)
    }
    case SEARCH_RESULT_CLICKED: {
      let obj = {
        clickedFeatureId: action.featureId
      }
      return Object.assign({}, state, obj)
    }
    default:
      return state
  }
}

const downloadDefaultState = {
  features: [],
  filter: {},
  hoveredFeatureId: null,
  clickedFeatureId: null
}
const downloadBundles = (state = downloadDefaultState, action) => {
  switch (action.type) {
    case DOWNLOAD_SET_FEATURES: {
      return Object.assign({}, state, {features: action.features})
    }
    case DOWNLOAD_SET_FILTER: {
      return Object.assign({}, state, {filter: action.filter})
    }
    case DOWNLOAD_HOVERED: {
      let obj = {
        hoveredFeatureId: action.featureId
      }
      return Object.assign({}, state, obj)
    }
    case DOWNLOAD_CLICKED: {
      let obj = {
        clickedFeatureId: action.featureId
      }
      return Object.assign({}, state, obj)
    }
    default:
      return state
  }
}

const mapApp = combineReducers({
  sidebarIsOpen,
  sidebarSelectedTab,
  layerVisible,
  viewPosition,
  selectedFeature,
  layerTileLoadState,
  search,
  downloadBundles
})

import { writeToUrlHash } from './urlHashHandling'

export default function configureStore (initialState) {
  const store = createStore(mapApp, initialState, compose(
    applyMiddleware(writeToUrlHash),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ))

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextReducer = require('../reducers')
      store.replaceReducer(nextReducer)
    })
  }

  return store
}
