/**
* @license AGPL-3.0
* @author mojoaxel (https://github.com/mojoaxel)
*/
'use strict';
import React from 'react'

import ReactToggle from 'react-toggle'
import 'react-toggle/style.css'
import './Toggle.scss'

class OsmToggle extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var toggleId = 'toggle_' + this.props.layerId + (this.props.checked ? '_checked' : '_unchecked');
    return (
      <div className="toggle">
        <ReactToggle
          id={ toggleId }
          defaultChecked={ this.props.checked }
          onChange={ (event) => this.props.onChange(event.target.checked) } />
        <label
          className="toggle-label"
          htmlFor={ toggleId }>
          { this.props.label }
        </label>
      </div>
      );
  }
}

OsmToggle.propTypes = {
  checked: React.PropTypes.bool.isRequired,
  label: React.PropTypes.node.isRequired,
  layerId: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired
}

export default OsmToggle
