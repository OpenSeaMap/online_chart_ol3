/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
import React, { PropTypes } from 'react'

var CircleProgressBar = require('rc-progress').Circle;

const LayerProgressBar = ({loadState, enabled}) => {
  let progress = 100
  if (enabled && loadState.loading)
    progress = loadState.loaded / loadState.loading * 100


  var circleContainerStyle = {
    'width': '24px',
    'height': '24px',
    'float': 'right',
    'marginTop': '3px'
  }
  let colors = {
    active: '#3FC7FA',
    inactive: '#c9c9c9',
    success: '#85D262',
    error: '#fc2024'
  }
  let color = colors.success
  if(progress < 100)
    color = colors.active
  if(loadState.lastError)
    color = colors.error
  if(!enabled)
    color = colors.inactive

  return (
    <div style={circleContainerStyle}>
      <CircleProgressBar
        percent={progress}
        strokeColor={color}
        strokeWidth="25" />
    </div>
  )
}

LayerProgressBar.propTypes = {
  enabled: PropTypes.bool,
  loadState: PropTypes.shape({
    loading: PropTypes.number,
    loaded: PropTypes.number
  }).isRequired
}
export default LayerProgressBar
