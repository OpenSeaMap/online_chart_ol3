/**
* @license AGPL-3.0
* @author mojoaxel (https://github.com/mojoaxel)
*/
'use strict'

import React from 'react'
import ol from 'openlayers'

class OL3Control extends React.Component {

  componentDidMount () {
    this.props.addControlToMap(this.getControl())
  }

  getControl () {
    return this._control ? this._control : this._createControl()
  }

  _createControl () {
    this._control = new ol.control.Control({
      target: this._element
    })
    return this._control
  }

  render () {
    return (
      <div className={this.props.className}
        ref={(c) => { this._element = c }} />
    )
  }
}
OL3Control.propTypes = React.PropTypes.shape({
  addControlToMap: React.PropTypes.func.isRequired,
  className: React.PropTypes.string,
  id: React.PropTypes.string.isRequired,
  position: React.PropTypes.string.isRequired
})

export default OL3Control
