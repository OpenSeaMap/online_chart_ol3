/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
* @author mojoaxel (https://github.com/mojoaxel)
*/
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl';

import { setLayerVisible } from '../../store/actions'
import { LayerType } from '../../config/chartlayer'
import OsmToggle from '../../components/misc/Toggle'

import LayerProgressBar from './layerProgressBar'

import './featureLayerConfig.scss'

const ConfigList = ({layerVisible, layerLoadState, onChangeLayerVisible} , context) => (
  <ul className="layerList">
    {context.layers.map(layer => {
        let loadState = layerLoadState[layer.id] || {loading: 0, loaded: 0}
        return (
          <li key={'layer_' + layer.id + (layerVisible[layer.id] ? '_checked' : '_unchecked')}>
            <LayerProgressBar
                enabled={!!(layerVisible[layer.id])}
                loadState={loadState}
            />
            <OsmToggle
                checked={!!(layerVisible[layer.id])}
                label={<FormattedMessage id={layer.nameKey} />}
                layerId={layer.id}
                onChange={(visible) => onChangeLayerVisible(layer.id, visible)}
            />
          </li>
      )})}
  </ul>
)
ConfigList.contextTypes = {
  layers: PropTypes.arrayOf(
    LayerType.isRequired
  ).isRequired
}

const mapStateToProps = (state) => {
  return {
    layerVisible: state.layerVisible,
    layerLoadState: state.layerTileLoadState
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onChangeLayerVisible: (id, visible) => {
      dispatch(setLayerVisible(id, visible))
    }
  }
}

const VisibleLayers = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfigList)

export default VisibleLayers
