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

import './featureLayerConfig.scss'

const mapStateToProps = (state) => {
  return {
    layerVisible: state.layerVisible
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onChangeLayerVisible: (id, visible) => {
      dispatch(setLayerVisible(id, visible))
    }
  }
}

const ConfigList = ({layerVisible, onChangeLayerVisible} , context) => (
  <ul className="layerList">
    { context.layers.map(layer => (
      <li key={ 'layer_' + layer.id }>
        <OsmToggle
          checked={ !!(layerVisible[layer.id]) }
          label={ <FormattedMessage id={ layer.nameKey } /> }
          onChange={ (visible) => onChangeLayerVisible(layer.id, visible) } />
      </li>
    )) }
  </ul>
)
ConfigList.contextTypes = {
  layers: PropTypes.arrayOf(
    LayerType.isRequired
  ).isRequired
}

const VisibleLayers = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfigList)

export default VisibleLayers
