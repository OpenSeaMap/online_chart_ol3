/**
* @license AGPL-3.0
* @author mojoaxel (https://github.com/mojoaxel)
*/
'use strict'
import './Links.scss'

import React from 'react'
import MdDownload from 'react-icons/lib/md/file-download'
import FaLink from 'react-icons/lib/fa/external-link'

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
    {' '}
    <FaLink />
  </NormalLink>
)
ExternalLink.propTypes = LinkPropTypes

/**
 * Link to file to download
 */
export const DownloadLink = (props) => (
  <NormalLink
    className='download'
    target='_blank'
    {...props}>
    { props.children }
    {' '}
    <MdDownload />
  </NormalLink>
)
DownloadLink.propTypes = LinkPropTypes
