/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
* @author mojoaxel (https://github.com/mojoaxel)
*/
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl';

import { setLayerVisible } from '../../store/actions'
import { LayerType } from '../../chartlayer'
import OsmToggle from '../../components/misc/Toggle'

import './featureLayerConfig.scss'

const mapStateToProps = (state) => {
  return {
    layerVisiblility: state.layerVisible
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onChangeLayerVisible: (id, visible) => {
      dispatch(setLayerVisible(id, visible))
    }
  }
}

const ConfigList = ({layerVisiblility, onChangeLayerVisible} , context) => (
  <ul className="layerList">
    { context.layers.map(layer => (
                            <li key={ 'layer_' + layer.index }>
                              <OsmToggle
                                checked={ !!(layerVisiblility[layer.index]) }
                                //key={ 'layer_' + layer.index }
                                label={ <FormattedMessage id={ layer.nameKey } /> }
                                onChange={ (visible) => onChangeLayerVisible(layer.index, visible) } />
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
