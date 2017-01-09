/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
import Map from './Map'
import { connect } from 'react-redux'
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

const VisibleLayers = connect(
  mapStateToProps,
  mapDispatchToProps
)(Map)

export default VisibleLayers
