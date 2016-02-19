
import Map from './Map'


const mapStateToProps = (state) => {
  return {
    layerVisiblility: state.layerVisible
  }
}

import { connect } from 'react-redux'

const VisibleLayers = connect(
  mapStateToProps
)(Map)

export default VisibleLayers
