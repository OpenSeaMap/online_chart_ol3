
import Map from './Map'
import LayerList from './config/layerlist'

import { setLayerVisible } from './store/actions'

const setLayersVisible = (layers, visibleList) => {
  Object.keys(visibleList).forEach((index) => {
    layers[index].layer.setVisible(visibleList[index].visible);
  })
  return layers;
}

const mapStateToProps = (state) => {
  return {
    layers: setLayersVisible(LayerList, state.layerVisible)
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

const VisibleLayers = connect(
  mapStateToProps,
  mapDispatchToProps
)(Map)

export default VisibleLayers
