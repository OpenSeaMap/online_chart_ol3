
import uniloc from 'uniloc'

const router = uniloc({
  default: 'GET /'
})

let hashUrl = '';

function compressPosition(position, numDecimals = 4){
  return {
    lat: position.lat.toFixed(numDecimals),
    lon: position.lon.toFixed(numDecimals),
    zoom: position.zoom
  }
}

function compressVisibleLayers(visibleLayers){
  let ids = Object.keys(visibleLayers);
  let arr = new Array(Math.max.apply(null, ids))
  arr.fill('-')
  ids.forEach(id => {
    arr[id] = visibleLayers[id] ? '1' : '0'
  })
  return arr.join(''); // convert to string
}

function decompressVisibleLayers(stringData) {
  let layers = {};
  let arr = stringData.split(''); // convert to array
  for(let i=0; i<arr.length; i++){
    switch(arr[i]){
      case '1':
        layers[i] = true;
        break;
      case '0':
        layers[i] = false;
        break;
    }
  }
  return layers;
}

export const writeToUrlHash = store => next => action => {
  let result = next(action);
  let state = store.getState();
  let options = Object.assign({},
    compressPosition(state.viewPosition),
    {
      layers: compressVisibleLayers(state.layerVisible)
    }
  )

  hashUrl = '#' + router.generate('default', options);
  window.location.hash = hashUrl;

  return result;
}

export function getStateFromUrlHash(defaults){
  if(window.location.hash === hashUrl)
    return defaults;

  let res = router.lookup(window.location.hash.substring(1));

  let pos = {}
  if(res.options.lon && res.options.lat && res.options.zoom) {
    pos = {
      viewPosition: {
        lon: parseFloat(res.options.lon),
        lat: parseFloat(res.options.lat),
        zoom: parseFloat(res.options.zoom)
      }
    }
  }

let layers = {}
if(res.options.layers) {
  layers = {
    layerVisible: decompressVisibleLayers(res.options.layers)
  }
}

  return Object.assign({}, defaults, pos, layers);
}
