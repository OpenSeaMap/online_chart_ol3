/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
* @author mojoaxel (https://github.com/mojoaxel)
*/
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Collapse } from 'react-bootstrap'

import { setLayerVisible } from '../../store/actions'
import { LayerType } from '../../config/chartlayer'
import OsmToggle from '../../components/misc/Toggle'

import LayerProgressBar from './layerProgressBar'

import './featureLayerConfig.scss'

class ConfigList extends React.Component {
  constructor (props) {
    super(props)
    this.currentBaseLayerId = this.currentBaseLayerId.bind(this)
    this.selectBaseLayer = this.selectBaseLayer.bind(this)
  }

  currentBaseLayerId () {
    let id
    this.context.layers.forEach(layer => {
      if (!layer.isBaseLayer) return
      if (this.props.layerVisible[layer.id]) {
        id = layer.id
      }
    }, this)
    return id
  }

  selectBaseLayer (id) {
    let currentBase = this.currentBaseLayerId()
    if (id === currentBase) return  // do not deactivate the current base layer
    if (currentBase) {
      this.props.onChangeLayerVisible(currentBase, false)
    }
    this.props.onChangeLayerVisible(id, true)
  }

  render () {
    return (
      <div>
        <div>
          <FormattedMessage id={'layerlist-baselayer'} />
        </div>
        <ul className="layerList base">
          {this.context.layers.map(layer => {
            let loadState = this.props.layerLoadState[layer.id] || {loading: 0, loaded: 0}
            let layerVisible = !!this.props.layerVisible[layer.id]
            if (!layer.isBaseLayer) return
            return (
              <li key={'layer_' + layer.id}>
                <LayerProgressBar
                  enabled={layerVisible}
                  loadState={loadState} />
                <OsmToggle
                  checked={layerVisible}
                  label={<FormattedMessage id={layer.nameKey} />}
                  layerId={layer.id}
                  onChange={() => this.selectBaseLayer(layer.id)} />
              </li>
            ) })}
        </ul>
        <div>
          <FormattedMessage id={'layerlist-overlaylayer'} />
        </div>
        <ul className="layerList overlays">
          {this.context.layers.map(layer => {
            let loadState = this.props.layerLoadState[layer.id] || {loading: 0, loaded: 0}
            let layerVisible = !!this.props.layerVisible[layer.id]
            if (layer.isBaseLayer) return
            return (
              <li key={'layer_' + layer.id}>
                <LayerProgressBar
                  enabled={layerVisible}
                  loadState={loadState} />
                <OsmToggle
                  checked={layerVisible}
                  label={<FormattedMessage id={layer.nameKey} />}
                  layerId={layer.id}
                  onChange={(visible) => this.props.onChangeLayerVisible(layer.id, visible)} />
                <Collapse
                  className="additionalSetup"
                  in={layerVisible}
                  unmountOnExit >
                  <div>
                    {layer.additionalSetup}
                  </div>
                </Collapse>
              </li>
            ) })}
        </ul>
      </div>
    )
  }
}
ConfigList.contextTypes = {
  layers: PropTypes.arrayOf(
    LayerType.isRequired
  ).isRequired
}

ConfigList.propTypes = {
  layerLoadState: PropTypes.objectOf(PropTypes.object),
  layerVisible: PropTypes.objectOf(PropTypes.bool),
  onChangeLayerVisible: PropTypes.func
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
