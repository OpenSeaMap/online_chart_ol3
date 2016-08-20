/**
* @license AGPL-3.0
* @author mojoaxel (https://github.com/mojoaxel)
*/
'use strict'
import React from 'react'

import ReactToggle from 'react-toggle'
import 'react-toggle/style.css'
import './Toggle.scss'

class OsmToggle extends React.Component {
  constructor (props) {
    super(props)
    this._onChange = this._onChange.bind(this)
  }

  _onChange (event) {
    this.props.onChange(event.target.checked)
  }

  render () {
    var toggleId = 'toggle_' + this.props.layerId + (this.props.checked ? '_checked' : '_unchecked')
    return (
      <div className="toggle">
        <ReactToggle
          checked={this.props.checked}
          id={toggleId}
          onChange={this._onChange} />
        <label
          className="toggle-label"
          htmlFor={toggleId}>
            {this.props.label}
        </label>
        {this.props.children}
      </div>
    )
  }
}

OsmToggle.propTypes = {
  checked: React.PropTypes.bool.isRequired,
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ]),
  label: React.PropTypes.node.isRequired,
  layerId: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired
}

export default OsmToggle
