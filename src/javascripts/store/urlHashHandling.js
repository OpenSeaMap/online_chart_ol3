/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
import uniloc from 'uniloc'
import _ from 'lodash'

const router = uniloc({
  default: 'GET /'
})

let hashUrl = ''

function compressPosition (position, numDecimals = 4) {
  return {
    lat: position.lat.toFixed(numDecimals),
    lon: position.lon.toFixed(numDecimals),
    zoom: position.zoom
  }
}

import {availibleBaseLayers, availibleOverlayLayers} from '../config/layerlist'
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

export const writeToUrlHash = store => next => action => {
  let result = next(action)
  let state = store.getState()
  if (!state.viewPosition.position) return result
  let options = Object.assign({},
    compressPosition(state.viewPosition.position),
                              {
                                layers: compressVisibleLayers(state.layerVisible)
                              }
  )

  hashUrl = '#' + router.generate('default', options)
  window.location.hash = hashUrl

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

  return Object.assign({}, defaults, pos, layers)
}
