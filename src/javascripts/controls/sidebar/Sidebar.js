/**
* @license AGPL-3.0
* @author mojoaxel (https://github.com/mojoaxel)
*/
'use strict'

import React from 'react'
import { FormattedMessage } from 'react-intl'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import FaAngleDoubleLeft from 'react-icons/lib/fa/angle-double-left'

import './Sidebar.scss'

class Sidebar extends React.Component {
  _getSidebarClassNames () {
    const pos = this.props.position
    return 'osm-sidebar ' +
      (pos.indexOf('left') >= 0 ? 'left ' : '') +
      (pos.indexOf('right') >= 0 ? 'right ' : '') +
      (this.props.isOpen ? 'open' : 'closed')
  }

  _renderOpenCloseBtn () {
    return (
      <button
        id='openCloseBtn'
        onClick={this.props.setSidebarOpen}>
        <FaAngleDoubleLeft className={this.props.isOpen ? 'open' : 'closed'} />
      </button>
    )
  }

  _getIsActiveClassName (tabName) {
    if (this.props.sidebarSelectedTab.trim().toLowerCase() === tabName.trim().toLowerCase()) {
      return ' active'
    } else {
      return ''
    }
  }

  _onTabClicked (tabName) {
    if (this.props.sidebarSelectedTab === tabName) {
      this.props.setSidebarOpen()
    } else {
      this.props.setSidebarActiveTab(tabName)
      this.props.setSidebarOpen(true)
    }
  }

  _renderTabButtonList (tabs, position) {
    return tabs.filter(tab => tab.align.toLowerCase() === position.toLowerCase()
    ).map(tab => (
      <li key={'button_' + tab.name.trim()}>
        <button
          className={this._getIsActiveClassName(tab.name)}
          onClick={() => this._onTabClicked(tab.name)}>
          { tab.icon }
        </button>
      </li>
    ))
  }

  render () {
    return (
      <div
        className={this._getSidebarClassNames()}
        ref={(c) => { this._element = c }}>
        <aside>
          { this._renderOpenCloseBtn() }
          <ul className='align-top'>
            { this._renderTabButtonList(this.props.tabs, 'top') }
          </ul>
          <ul className='align-bottom'>
            { this._renderTabButtonList(this.props.tabs, 'bottom') }
          </ul>
        </aside>
        <main>
          { this.props.tabs.map(tab => (
            <article
              key={'content_' + tab.name.trim()}
              className={'sidebar-panel ' + this._getIsActiveClassName(tab.name)}>
              <header>
                <h1>
                  <FormattedMessage id={tab.name} />
                </h1>
              </header>
              <div className='content'>
                { tab.content }
              </div>
            </article>
            )) }
        </main>
      </div>
    )
  }
}

import {TabType} from 'features/tabs'

Sidebar.propTypes = {
  isOpen: React.PropTypes.bool.isRequired,
  position: React.PropTypes.string.isRequired,
  setSidebarActiveTab: React.PropTypes.func.isRequired,
  setSidebarOpen: React.PropTypes.func.isRequired,
  sidebarSelectedTab: React.PropTypes.string.isRequired,
  tabs: React.PropTypes.arrayOf(TabType).isRequired
}

function mapStateToProps (state) {
  return {
    isOpen: state.sidebarIsOpen,
    sidebarSelectedTab: state.sidebarSelectedTab
  }
}

import { setSidebarOpen, setSidebarActiveTab } from './store'

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    setSidebarOpen: setSidebarOpen,
    setSidebarActiveTab: setSidebarActiveTab
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
