/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
* @author mojoaxel (https://github.com/mojoaxel)
*/
'use strict'

import ReactDOM from 'react-dom'
import React, { PropTypes } from 'react'

import { IntlProvider } from 'react-intl'

import VisibleLayers from './visibleLayers'
import { createLayers } from './config/layerlist'
import configureStore from './store/reducers'
import { initLayerVisible, setViewPosition } from './store/actions'
import { getStateFromUrlHash } from './store/urlHashHandling'
import { positionsEqual } from './utils'
import { defaultViewPosition } from './SETTINGS'

let hashState = getStateFromUrlHash({
  viewPosition: defaultViewPosition
})
let store = configureStore(hashState)

let layers = createLayers(store)

let defaultVisibleList = {}
if (hashState.layerVisible) { // use layer state from url if provided
  defaultVisibleList = hashState.layerVisible
} else {
  layers.forEach(layer => {
    defaultVisibleList[layer.id] = layer.visibleDefault
  })
}
store.dispatch(initLayerVisible(defaultVisibleList))

function onHashChange () {
  let oldState = store.getState()
  let newState = getStateFromUrlHash(oldState)

  if (!positionsEqual(newState.viewPosition.position, oldState.viewPosition.position)) {
    store.dispatch(setViewPosition(newState.viewPosition.position))
  }

  if (oldState.layerVisible !== newState.layerVisible) {
    store.dispatch(initLayerVisible(newState.layerVisible))
  }
}

// Handle browser navigation events
window.addEventListener('hashchange', onHashChange, false)

import { Provider } from 'react-redux'

// todo: wrap Sidebar by redux store and set visible tab based on state

const locale = 'en'
const messages = {
  'test': 'key: {key} / value: {value}',
  'tags': 'Tags',

  'sidebar-settings': 'Settings',
  'sidebar-details': 'Details',
  'sidebar-development': 'Development',
  'sidebar-search': 'Search',

  'layerlist-baselayer': 'Base layers',
  'layerlist-overlaylayer': 'Overlay layers',

  'layer-name-search': 'Search',
  'layer-name-seamarks': 'OpenSeaMap seamarks',
  'layer-name-depth-geodaten_mv': 'Official depth data for Germany/MV',
  'layer-name-int1_base': 'INT1 style basemap',
  'layer-name-openstreetmap-base': 'OpenStreetMap basemap',
  'layer-name-base-vector': 'Basemap (vector)',
  'layer-name-scuba_diving': 'POIs for scuba diving',
  'layer-name-seamarks-debug': 'Interactive Seamarks',
  'layer-name-marinetraffic': 'Marine traffic',
  'layer-name-grid-wgs': 'Coordinate grid',

  'click-on-markers': 'click on markers to see details',
  'copyright-layer': 'Layer data © {source}',
  'search-results': 'Results: {numberResults}',
  'search-start-for-results': 'Start a search to get results.',
  'search-error': 'Your search returned an error: {message}.',
  'search-running': 'Your search is running. Please wait.',
  'search-empty-result': 'No results found.',
  'vectorLayer-show-buildings': 'Show buildings',
  'vectorLayer-use-nightmode': 'Show map in night mode'
}

import { LayerType } from './config/chartlayer'

class MapLayerProvider extends React.Component {
  getChildContext () {
    return {
      layers: this.props.layers
    }
  }
  render () {
    return this.props.children
  }
}
MapLayerProvider.childContextTypes = {
  layers: PropTypes.arrayOf(LayerType.isRequired).isRequired,
  store: React.PropTypes.object
}
MapLayerProvider.propTypes = {
  children: PropTypes.node,
  layers: PropTypes.arrayOf(LayerType.isRequired).isRequired
}

function runMyApp () {
  ReactDOM.render((
    <IntlProvider
      locale={locale}
      messages={messages}>
      <Provider store={store}>
        <MapLayerProvider layers={layers}>
          <VisibleLayers />
        </MapLayerProvider>
      </Provider>
    </IntlProvider>),
  document.getElementById('map')
)
}

if (!global.Intl) {
  require.ensure([
    'intl',
    'intl/locale-data/jsonp/en.js'
  ], function (require) {
    require('intl')
    require('intl/locale-data/jsonp/en.js')
    runMyApp()
  })
} else {
  runMyApp()
}
