/**
* @license AGPL-3.0
* @author mojoaxel (https://github.com/mojoaxel)
*/
'use strict'
import './Links.scss'

import React from 'react'

let LinkPropTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ]).isRequired,
  href: React.PropTypes.string.isRequired,
  title: React.PropTypes.string
}

/**
 * normal Link.
 */
export const NormalLink = (props) => (
  <a
    role='link'
    href={props.href}
    title={props.title || ''}
    {...props}>
    { props.children }
  </a>
)
NormalLink.propTypes = LinkPropTypes

/**
 * Link to external page.
 */
export const ExternalLink = (props) => (
  <NormalLink
    className='external'
    target='_blank'
    {...props}>
    { props.children }
  </NormalLink>
)
ExternalLink.propTypes = LinkPropTypes

/**
 * Link to file to download
 */
export const DownloadLink = (props) => (
  <ExternalLink
    className='download'
    {...props}>
    { props.children }
  </ExternalLink>
)
DownloadLink.propTypes = LinkPropTypes
