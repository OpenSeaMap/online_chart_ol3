'use strict';

import React, {PropTypes} from 'react'

var $ = require('jquery');
require('bootstrap-toggle');

export default class BootstrapToggle extends React.Component{

  componentDidMount() {
    $(this._input).bootstrapToggle();
    this.setBootstrapToggleState(this._input, this.props.checked);
    $(this._input).on('change', () => {
      if(this.changeFromSelf)
        return;
      this.props.onToggled(!this.props.checked);
      this.setBootstrapToggleState(this._input, this.props.checked);
    })
  }
  componentWillReceiveProps(nextProps) {
    this.setBootstrapToggleState(this._input, nextProps.checked);
  }

  setBootstrapToggleState(element, value) {
    this.changeFromSelf = true;
    $(element).prop('checked', value).change()
    this.changeFromSelf = false;
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
