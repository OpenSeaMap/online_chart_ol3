/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict';

import React, { PropTypes } from 'react'

import { FormattedMessage } from 'react-intl';
import { Glyphicon } from 'react-bootstrap'

var $ = require('jquery');
require('jquerySidebar');

class Sidebar extends React.Component {

  componentDidMount() {
    this.jSidebar = $(this._input).sidebar();
  }

  getDomNode() {
    return this._input;
  }
  getJSidebar() {
    return this.jSidebar;
  }

  render() {
    return (
      <div
        className="sidebar collapsed reset-box-sizing"
        ref={ (c) => this._input = c }>
        <div className="sidebar-tabs">
          <ul role="tablist">
            { this.props.tabs.map(tab => (
                <li key={ tab.name }>
                  <a
                    role="tab"
                    href={ '#' + tab.name }>
                    <Glyphicon glyph={ tab.tabSymbol } />
                  </a>
                </li>
              )) }
          </ul>
        </div>
        <div className="sidebar-content set-box-sizing">
          { this.props.tabs.map(tab => (
              <div
                className="sidebar-pane"
                id={tab.name}
                key={tab.name} >
              <h1 className="sidebar-header">
                <FormattedMessage id={'sidebar-' + tab.name} />
                <div className="sidebar-close">
                  <Glyphicon glyph="menu-left"/>
                </div>
              </h1>
              <div className="container-fluid">
                <div className="row">
                  <div className="col-xs-12">
                    {tab.content}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export const SidebarTabType = PropTypes.arrayOf(PropTypes.shape({
  name: PropTypes.string.isRequired,
  tabSymbol: PropTypes.string.isRequired,
  content: PropTypes.node
}).isRequired)

Sidebar.propTypes = {
  tabs: SidebarTabType.isRequired
}

export default Sidebar
