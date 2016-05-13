/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
import uniloc from 'uniloc'
import _ from 'lodash'

const router = uniloc({
  default: 'GET /'
})

let hashUrl = '';

function compressPosition(position, numDecimals = 4) {
  return {
    lat: position.lat.toFixed(numDecimals),
    lon: position.lon.toFixed(numDecimals),
    zoom: position.zoom
  }
}

import { availibleLayers } from '../config/layerlist'
function compressVisibleLayers(visibleLayers) {
  let arr = new Array(availibleLayers.length);
  arr.fill('-');
  let ids = Object.keys(visibleLayers);
  ids.forEach(id => {
    let layer = _.find(availibleLayers, { 'id': id })
    arr[layer.urlIndex2016] = visibleLayers[id] ? '1' : '0'
  })
  return arr.join(''); // convert to string
}

function decompressVisibleLayers(layersString) {
  let layers = {};
  let arr = layersString.split(''); // convert to array

  if (/^[BFT0]{5,}$/.test(layersString)) {
    /* e.g. layers=BFFFFTFFFTF0TFFFFTTTFT */
    console.warn('This layers format is depricated. Please update your url parameter to the new standart.')
    for (let i = 0; i <= arr.length; i++) {
      let layer = _.find(availibleLayers, { 'urlIndex2013': i });
      if (layer) layers[layer.id] = _.indexOf(['B','T'], arr[i]) >= 0;
    }
    return layers
  } else if (/^[01-]*$/.test(layersString)) {
    /* e.g. layers=010-10 */
    for (let i = 0; i <= arr.length; i++) {
      let layer = _.find(availibleLayers, { 'urlIndex2016': i });
      if (layer) layers[layer.id] = (arr[i] === '1');
    }
  } else {
    console.error('invalid layers format: ', layersString);
  }

  return layers
}

export const writeToUrlHash = store => next => action => {
  let result = next(action);
  let state = store.getState();
  console.log('state: ', state);
  let options = Object.assign({},
    compressPosition(state.viewPosition),
    { layers: compressVisibleLayers(state.layerVisible) }
  )

  hashUrl = '#' + router.generate('default', options);
  window.location.hash = hashUrl;

  return result;
}

export function getStateFromUrlHash(defaults) {
  if (window.location.hash === hashUrl)
    return defaults;

  let res = router.lookup(window.location.hash.substring(1));

  let pos = {}
  if (res.options.lon && res.options.lat && res.options.zoom) {
    pos = {
      viewPosition: {
        lon: parseFloat(res.options.lon),
        lat: parseFloat(res.options.lat),
        zoom: parseFloat(res.options.zoom)
      }
    }
  }

  let layers = {}
  if (res.options.layers) {
    layers = {
      layerVisible: decompressVisibleLayers(res.options.layers)
    }
  }

  return Object.assign({}, defaults, pos, layers);
}
