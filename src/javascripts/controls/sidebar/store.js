/**
* @license AGPL-3.0
* @author mojoaxel (https://github.com/mojoaxel)
*/
'use strict'
import { isMobile } from '../../utils'

/**
 * ACTIONS
 */
export const TOGGLE_SIDEBAR_OPEN = 'TOGGLE_SIDEBAR_OPEN'
export const SET_SIDEBAR_OPEN = 'SET_SIDEBAR_OPEN'
export function setSidebarOpen (setOpen) {
  if (typeof setOpen === 'undefined') {
    return {
      type: TOGGLE_SIDEBAR_OPEN
    }
  } else {
    return {
      type: SET_SIDEBAR_OPEN,
      setOpen: setOpen
    }
  }
}

export const SET_SIDEBAR_ACTIVE_TAB = 'SET_SIDEBAR_ACTIVE_TAB'
export function setSidebarActiveTab (tabName) {
  return {
    type: SET_SIDEBAR_ACTIVE_TAB,
    tabName: tabName
  }
}

/**
 * REDUCERS
 */
export function sidebarIsOpen (state, action) {
  // set default value
  if (typeof state === 'undefined') {
    // close the sidebar in mobile devices
    return !isMobile()
  }

  switch (action.type) {
    case TOGGLE_SIDEBAR_OPEN:
      return !state

    case SET_SIDEBAR_OPEN:
      return action.setOpen

    default:
      return state
  }
}

export function sidebarSelectedTab (state = 'sidebar-settings', action) {
  switch (action.type) {
    case SET_SIDEBAR_ACTIVE_TAB:
      return action.tabName

    default:
      return state
  }
}
