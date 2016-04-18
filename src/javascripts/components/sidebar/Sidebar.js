/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict';
import './ol3-sidebar.scss'

import React, { PropTypes } from 'react'

import { FormattedMessage } from 'react-intl';
import { Glyphicon } from 'react-bootstrap'

class Sidebar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
      activePanel: null
    };
    this.closeSidebar.bind(this);
    this.switchTab.bind(this);
  }

  open() {
    this.setState({
      collapsed: false,
      activePanel: this.state.activePanel
    });
  }

  close() {
    this.setState({
      collapsed: true,
      activePanel: this.state.activePanel
    });
  }

  switchTab(tabId) {
    var activePanel = tabId || this.state.activePanel;
    var collapsed = (activePanel == this.state.activePanel) ? !this.state.collapsed : false;
    this.setState({
      collapsed: collapsed,
      activePanel: activePanel
    });
  }

  componentDidMount() {
    this.jSidebar = this._input;
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
        className={'sidebar sidebar-left reset-box-sizing ' + (this.state.collapsed ? 'collapsed' : '')}
        ref={ (c) => this._input = c }>
        <div className="sidebar-tabs">
          <ul role="tablist">
            { this.props.tabs.map(tab => (
                <li key={ tab.name }>
                  <a role="tab"
                    href={ '#' + tab.name }
                    onClick={ () => this.switchTab(tab.name) }>
                    <Glyphicon glyph={ tab.tabSymbol } />
                  </a>
                </li>
              )) }
          </ul>
        </div>
        <div className="sidebar-content set-box-sizing">
          { this.props.tabs.map(tab => (
              <div className={ 'sidebar-left sidebar-pane ' + (this.state.activePanel == tab.name ? 'active' : '')}
                id={ tab.name }
                key={ tab.name }>
                <h1 className="sidebar-header">
                  <FormattedMessage id={ 'sidebar-' + tab.name }/>
                  <div className="sidebar-close"
                    onClick={ () => this.close() }>
                    <Glyphicon glyph="menu-left"/>
                  </div>
                </h1>
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-xs-12">
                      { tab.content }
                    </div>
                  </div>
                </div>
              </div>
            )) }
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
