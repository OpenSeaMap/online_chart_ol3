/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
import Map from './Map'

import { setViewPosition, setViewToExtent } from './store/actions'
const mapStateToProps = (state) => {
  return {
    layerVisible: state.layerVisible,
    viewPosition: state.viewPosition,
    viewExtent: state.viewExtent
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    onViewPositionChange: (pos) => {
      dispatch(setViewPosition(pos))
    },
    onViewExtentChange: (extent) => {
      dispatch(setViewToExtent(extent))
    }
  }
}

import { connect } from 'react-redux'

const VisibleLayers = connect(
  mapStateToProps,
  mapDispatchToProps
)(Map)

export default VisibleLayers
