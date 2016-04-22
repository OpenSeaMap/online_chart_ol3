/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict';
import './ol3-sidebar.scss'

import React, { PropTypes } from 'react'

//import { FormattedMessage } from 'react-intl';
import { Glyphicon } from 'react-bootstrap'

import SidebarPanel from './SidebarPanel'

class Sidebar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      activePanel: 'main' //default panel
    };
    this.close.bind(this);
    this.switchTab.bind(this);
    this.getDomNode.bind(this);
  }

  open() {
    this.switchTab(this.state.activePanel)
  }

  close() {
    this.setState({
      collapsed: true,
      activePanel: this.state.activePanel
    });
  }

  switchTab(tabId) {
    console.log('switchTab');
    var activePanel = tabId || this.state.activePanel;
    var collapsed = (activePanel == this.state.activePanel) ? !this.state.collapsed : false;
    this.setState({
      collapsed: collapsed,
      activePanel: activePanel
    });
  }

  getDomNode() {
    return this._domNode;
  }

  render() {
    return (
      <div
        className={'sidebar sidebar-left reset-box-sizing ' + (this.state.collapsed ? 'collapsed' : '')}
        ref={ (c) => this._domNode = c }>
        <div className="sidebar-tabs">
          <ul role="tablist" className="top">
            { this.props.tabs.filter((tab) => !tab.position || tab.position == 'top').map(tab => (
                <li key={ tab.name }>
                  <a role="tab"
                    href={ '#' + tab.name }
                    onClick={ () => this.switchTab(tab.name) }>
                    <Glyphicon glyph={ tab.tabSymbol } />
                  </a>
                </li>
              )) }
          </ul>
          <ul role="tablist" className="bottom">
            { this.props.tabs.filter((tab) => tab.position && tab.position == 'bottom').map(tab => (
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
            <SidebarPanel
              key={ tab.name }
              name={ tab.name }
              isActive={ !!(this.state.activePanel == tab.name) }
              content={ tab.content }
              onClose={ () => this.close() } />
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
