/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
* @author mojoaxel (https://github.com/mojoaxel)
*/
'use strict'

import ReactDOM from 'react-dom'
import React, { PropTypes } from 'react'

import { addLocaleData } from 'react-intl'
import IntlProvider from './intlProvider'

import VisibleLayers from './visibleLayers'
import { createLayers } from './config/layerlist'
import configureStore from './store/reducers'
import { initLayerVisible } from './store/actions'
import { getStateFromUrlHash, initHashChangeHandling } from './store/urlHashHandling'
import { defaultViewPosition } from './SETTINGS'

import enLocaleData from 'react-intl/locale-data/en'
addLocaleData(enLocaleData)
import deLocaleData from 'react-intl/locale-data/de'
addLocaleData(deLocaleData)

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

initHashChangeHandling(store)

import { Provider } from 'react-redux'
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
    <Provider store={store}>
      <IntlProvider>
        <MapLayerProvider layers={layers}>
          <VisibleLayers />
        </MapLayerProvider>
      </IntlProvider>
    </Provider>),
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
