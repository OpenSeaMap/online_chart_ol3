/**
* @license AGPL-3.0
* @author mojoaxel (https://github.com/mojoaxel)
*/
'use strict';
import React from 'react'
import _ from 'lodash'

import './MetaControl.scss'

class MetaControl extends React.Component {
  getDomNode(id) {
    var elm = document.getElementById(id);
    return elm ? elm : this._container;
  }

  getControlsByPosition(position) {
    var childControls = _.filter(this.props.children, function(c) {
      return c.props.position === position.toLowerCase()
    });
    return childControls.map(control => (
      <div
        className="flbx-control"
        id={ control.props.id }
        key={ control.props.id }>
        { control }
      </div>
    ));
  }

  render() {
    return (
      <div
        className="flbx-container"
        ref={ (c) => this._container = c }>
        <div className="flbx-sidebar left">
          { this.getControlsByPosition('sidebar left') }
        </div>
        <div className="flbx-center">
          <div className="flbx-top">
            <div className="flbx-top left">
              { this.getControlsByPosition('top left') }
            </div>
            <div className="flbx-top right">
              { this.getControlsByPosition('top right') }
            </div>
          </div>
          <div className="flbx-bottom">
            <div className="flbx-bottom left">
              { this.getControlsByPosition('bottom left') }
            </div>
            <div className="flbx-bottom right">
              { this.getControlsByPosition('bottom right') }
            </div>
          </div>
        </div>
        <div className="flbx-sidebar right">
          { this.getControlsByPosition('sidebar right') }
        </div>
      </div>
    )
  }
}

import OL3Control from '../ol3/OL3Control'

MetaControl.propTypes = {
  children: React.PropTypes.arrayOf(OL3Control.propTypes).isRequired
}

export default MetaControl
