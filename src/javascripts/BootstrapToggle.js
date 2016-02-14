'use strict';

import React, {PropTypes} from 'react'

var $ = require('jquery');
require('bootstrap-toggle');

export default class BootstrapToggle extends React.Component{

  componentDidMount() {
    $(this._input).bootstrapToggle();
    this.setBootstrapToggleState(this._input, this.props.checked);
    $(this._input).on('change', (e) => {
      //e.preventDefault();
      this.props.onToggled(!this.props.checked);
//      this.setBootstrapToggleState(this._input, this.props.checked);
    })
  }
  componentWillReceiveProps(nextProps) {
    this.setBootstrapToggleState(this._input, nextProps.checked);
  }

  setBootstrapToggleState(element, value) {
    var disabled = $(element).prop('disabled');
    $(element).bootstrapToggle('enable');
    $(element).bootstrapToggle(value ? 'on' : 'off');
    if (disabled)
      $(element).bootstrapToggle('disable');
  }

  render() {
    return (
      <div className="checkbox">
        <label>
          <input
              data-toggle="toggle"
              ref={(c) => this._input = c}
              type="checkbox"
          />
          <span>{this.props.children}</span>
        </label>
      </div>
    )
  }
}

BootstrapToggle.propTypes = {
  checked: PropTypes.bool,
  children: PropTypes.node,
  onToggled: PropTypes.func.isRequired
}
