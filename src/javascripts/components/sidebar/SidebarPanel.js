/**
* @license AGPL-3.0
* @author mojoaxel (https://github.com/mojoaxel)
*/
'use strict';
import './ol3-sidebar.scss'

import React, { PropTypes } from 'react'

import { FormattedMessage } from 'react-intl';
import { Glyphicon } from 'react-bootstrap'

class SidebarPanel extends React.Component {
  render() {
    return (
      <div className={ 'sidebar-left sidebar-pane ' + (this.props.isActive ? 'active' : '') }
        key={ this.props.name }
        id={ this.props.name }>
        <h1 className="sidebar-header">
          <FormattedMessage id={ 'sidebar-' + this.props.name }/>
          <div className="sidebar-close"
            onClick={ () => this.props.onClose() }>
            <Glyphicon glyph="menu-left"/>
          </div>
        </h1>
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12">
              { this.props.content }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

SidebarPanel.propTypes = {
  isActive: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  content: PropTypes.node,
  onClose: PropTypes.func.isRequired
}

export default SidebarPanel
