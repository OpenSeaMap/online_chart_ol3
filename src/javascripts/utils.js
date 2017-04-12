/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
import viewSize from 'screen-size'

import React from 'react'
import { FormattedMessage } from 'react-intl'

export function floatEqual (num1, num2, eps = 0.0001) {
  if (num1 === num2) return true
  return Math.abs(num1 - num2) <= eps
}

export function positionsEqual (pos1, pos2) {
  if (pos1 === pos2) return true
  let epsilon = 0.0001
  return floatEqual(pos1.lat, pos2.lat, epsilon) &&
    floatEqual(pos1.lan, pos2.lan, epsilon) &&
    floatEqual(pos1.zoom, pos2.zoom, epsilon)
}

export function isMobile () {
  return (viewSize().x <= 768)
}

export function hashCode (str) {
  return str.split('').reduce((prevHash, currVal) =>
    ((prevHash << 5) - prevHash) + currVal.charCodeAt(0), 0)
}
export const ClickOnMarkersMessage = () => (
  <FormattedMessage
    id='click-on-markers'
    description='Inform users about interactive map elements'
    defaultMessage='Click on the markers on the map.'
  />
)
