/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
import Map from './Map'

import { setViewPosition } from './store/actions'
const mapStateToProps = (state) => {
  return {
    layerVisible: state.layerVisible,
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
