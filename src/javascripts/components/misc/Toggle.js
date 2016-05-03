/**
* @license AGPL-3.0
* @author mojoaxel (https://github.com/mojoaxel)
*/
'use strict';
import React, { PropTypes } from 'react'

import Toggle from 'react-toggle'
import 'react-toggle/style.css'
import './Toggle.scss'

class MyToggle extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="toggle">
        <Toggle
          id={ this.props.key }
          defaultChecked={ this.props.checked }
          onChange={ (event) => {
            this.props.onChange(event.target.checked)
          }} />
        <label className="toggle-label"
          htmlFor={ this.props.key } >
          { this.props.label }
        </label>
      </div>
    );
  }
}

MyToggle.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.node.isRequired
}

module.exports = MyToggle
