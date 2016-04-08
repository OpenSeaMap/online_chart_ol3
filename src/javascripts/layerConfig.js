
import React, { PropTypes } from 'react'
import Toggle from './BootstrapToggle'

import { FormattedMessage } from 'react-intl';
import { setLayerVisible } from './store/actions'

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
import { connect } from 'react-redux'
import { LayerType } from './chartlayer'

const ConfigList = ({layerVisiblility, onChangeLayerVisible} , context) => (
  <div>
    { context.layers.map(layer => (
        <Toggle
          checked={ layerVisiblility[layer.index] }
          key={ layer.index }
          onToggled={ (visible) => {
                        onChangeLayerVisible(layer.index, visible)
                      } }>
          <FormattedMessage id={ layer.nameKey } />
        </Toggle>
      )) }
  </div>
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
