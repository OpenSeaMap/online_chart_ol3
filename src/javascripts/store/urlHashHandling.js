/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
import uniloc from 'uniloc'
import _ from 'lodash'
import {SearchTab} from 'config/layers/search'
import {DownloadTab} from 'config/layers/downloadBundles'
import {getExistingLocaleForCode, defaultLocale} from '../intlProvider'
import {availibleBaseLayers, availibleOverlayLayers} from '../config/layerlist'

import {
  searchDefaultState, SEARCH_STATE_RUNNING,
  downloadDefaultState
} from './reducers'
import {sidebarDefaultState, setSidebarActiveTab} from 'controls/sidebar/store'
import {
  initLayerVisible,
  setViewPosition,
  searchStart,
  downloadSetFilter,
  downloadClicked,
  setLocale
} from './actions'
import { positionsEqual } from 'utils'

const router = uniloc({
  default: 'GET /',
  search: 'GET /search/:query',
  download: 'GET /download/:format/:clickedId'
})

let hashUrl = ''

function compressPosition (position, numDecimals = 4) {
  return {
    lat: position.lat.toFixed(numDecimals),
    lon: position.lon.toFixed(numDecimals),
    zoom: position.zoom
  }
}

function compressVisibleLayers (visibleLayers) {
  let baseLayerCode = '_'
  let arr = new Array(availibleOverlayLayers.length)
  arr.fill('-')
  let ids = Object.keys(visibleLayers)
  ids.forEach(id => {
    let layerOverlay = _.find(availibleOverlayLayers, {
      'id': id
    })
    if (layerOverlay) {
      arr[layerOverlay.urlIndex2016] = visibleLayers[id] ? '1' : '0'
    }

    let layerBase = _.find(availibleBaseLayers, {
      'id': id
    })
    if (layerBase && visibleLayers[id]) {
      baseLayerCode = layerBase.urlIndex2016BaseLayer
    }
  })
  return baseLayerCode + arr.join('') // convert to string
}

function decompressVisibleLayers (layersString) {
  let layers = {}
  let allLayers = availibleBaseLayers.concat(availibleOverlayLayers)
  allLayers.forEach(layer => {
    layers[layer.id] = false
  })

  let baseLayerString = layersString.substring(0, 1)
  let overlayString = layersString.substring(1)

  if (/^[BFT0]{5,}$/.test(layersString)) {
    /* e.g. layers=BFFFFTFFFTF0TFFFFTTTFT */
    console.warn('This layers format is depricated. Please update your url parameter to the new standart.')
    let arr = layersString.split('') // convert to array
    for (let i = 0; i < arr.length; i++) {
      let layer = _.find(allLayers, {
        'urlIndex2013': i + 1
      })
      if (layer) layers[layer.id] = _.indexOf(['B', 'T'], arr[i]) >= 0
    }
    return layers
  } else if (/^[01-]*$/.test(overlayString)) {
    /* e.g. layers=A010-10 */
    let arr = overlayString.split('') // convert to array
    for (let i = 0; i < arr.length; i++) {
      let layer = _.find(availibleOverlayLayers, {
        'urlIndex2016': i
      })
      if (layer) layers[layer.id] = (arr[i] === '1')
    }

    let baseLayer = _.find(availibleBaseLayers, {
      urlIndex2016BaseLayer: baseLayerString
    })
    if (baseLayer) {
      layers[baseLayer.id] = true
    } else {
      console.error('no base layer detected ', layersString)
    }
  } else {
    console.error('invalid layers format: ', layersString)
  }

  return layers
}

let hashIsChangingFromSystem = false

export const writeToUrlHash = store => next => action => {
  let result = next(action)
  let state = store.getState()
  if (!state.viewPosition.position) return result // skip if view is not stable

  let options = Object.assign({},
    compressPosition(state.viewPosition.position),
    {
      layers: compressVisibleLayers(state.layerVisible)
    }
  )
  options.lang = state.locale

  let routeName = 'default'
  if (state.sidebar.selectedTab === SearchTab.name) {
    routeName = 'search'
    options.query = state.search.query
  }
  if (state.sidebar.selectedTab === DownloadTab.name) {
    routeName = 'download'
    options.format = state.downloadBundles.filter.format
    options.clickedId = state.downloadBundles.clickedFeatureId
  }

  hashUrl = '#' + router.generate(routeName, options)

  hashIsChangingFromSystem = true
  window.location.hash = hashUrl
  hashIsChangingFromSystem = false

  return result
}

export function getStateFromUrlHash (defaults) {
  if (window.location.hash === hashUrl) return defaults

  let res = router.lookup(window.location.hash.substring(1))

  let pos = {}
  if (res.options.lon && res.options.lat && res.options.zoom) {
    pos = {
      viewPosition: {
        position: {
          lon: parseFloat(res.options.lon),
          lat: parseFloat(res.options.lat),
          zoom: parseFloat(res.options.zoom)
        }
      }
    }
  }

  let layers = {}
  if (res.options.layers) {
    layers = {
      layerVisible: decompressVisibleLayers(res.options.layers)
    }
  }
  let additions = {}

  if (res.options.lang) {
    additions.locale = getExistingLocaleForCode(res.options.lang)
  } else {
    additions.locale = defaultLocale
  }

  switch (res.name) {
    case 'search':
      additions.sidebar = sidebarDefaultState
      additions.sidebar.selectedTab = SearchTab.name
      if (res.options.query) {
        additions.search = searchDefaultState
        additions.search.query = res.options.query
        additions.search.state = SEARCH_STATE_RUNNING
      }
      break
    case 'download':
      additions.sidebar = sidebarDefaultState
      additions.sidebar.selectedTab = DownloadTab.name
      if (res.options.format) {
        additions.downloadBundles = downloadDefaultState
        if (res.options.format) {
          additions.downloadBundles.filter = {format: res.options.format}
        }
        if (res.options.clickedId) {
          additions.downloadBundles.clickedFeatureId = Number(res.options.clickedId)
        }
      }
      break
  }

  return Object.assign({}, defaults, pos, layers, additions)
}

let store
function onHashChange () {
  if (hashIsChangingFromSystem) return
  let oldState = store.getState()
  let newState = getStateFromUrlHash(oldState)

  store.dispatch(setSidebarActiveTab(newState.sidebar.selectedTab))

  if (oldState.search.query !== newState.search.query) {
    store.dispatch(searchStart(newState.search.query))
  }

  if (oldState.downloadBundles.filter !== newState.downloadBundles.filter) {
    store.dispatch(downloadSetFilter(newState.downloadBundles.filter))
  }
  if (oldState.downloadBundles.clickedFeatureId !== newState.downloadBundles.clickedFeatureId) {
    store.dispatch(downloadClicked(newState.downloadBundles.clickedFeatureId))
  }

  if (!positionsEqual(newState.viewPosition.position, oldState.viewPosition.position)) {
    store.dispatch(setViewPosition(newState.viewPosition.position))
  }

  if (oldState.layerVisible !== newState.layerVisible) {
    store.dispatch(initLayerVisible(newState.layerVisible))
  }

  if (oldState.locale !== newState.locale) {
    store.dispatch(setLocale(newState.locale))
  }
}

export const initHashChangeHandling = (store_) => {
  store = store_
  // Handle browser navigation events
  window.addEventListener('hashchange', onHashChange, false)
}
