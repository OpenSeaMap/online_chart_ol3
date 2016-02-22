
import Map from './Map'


import { setViewPosition } from './store/actions'
const mapStateToProps = (state) => {
  return {
    layerVisiblility: state.layerVisible,
    viewPosition: state.viewPosition
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    onViewPositionChange: (pos) => {
      dispatch(setViewPosition(pos))
    }
  }
}

import { connect } from 'react-redux'

const VisibleLayers = connect(
  mapStateToProps,
  mapDispatchToProps
)(Map)

export default VisibleLayers
