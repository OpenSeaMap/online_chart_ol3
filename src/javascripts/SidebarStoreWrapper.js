/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict';

import React, { PropTypes } from 'react'
import Sidebar from './Sidebar'

class SidebarStore extends React.Component {

  componentDidMount() {
    this.handleEvent = this.handleEvent.bind(this);
    let store = this.context.store;
    this.lastState = store.getState();
    this.unsubscribe = store.subscribe(this.handleEvent);
  }
  componentWillUnmount() {
    this.unsubscribe();
  }

  handleEvent() {
    let sidebar = this.getJSidebar();
    let state = this.context.store.getState();

    if (this.lastState.selectedFeature !== state.selectedFeature) {
      if (state.selectedFeature.hasFeature) {
        sidebar.open('details')
      } else {
        sidebar.close()
      }
    }
    this.lastState = state;
  }

  getDomNode() {
    return this._sidebar.getDomNode();
  }
  getJSidebar() {
    return this._sidebar.getJSidebar();
  }

  render() {
    return (
      <Sidebar
        ref={ (c) => this._sidebar = c }
        tabs={ this.props.tabs } />
    )
  }
}
import { SidebarTabType } from './Sidebar'

SidebarStore.propTypes = {
  tabs: SidebarTabType.isRequired
}
SidebarStore.contextTypes = {
  store: PropTypes.object.isRequired
}

export default SidebarStore
