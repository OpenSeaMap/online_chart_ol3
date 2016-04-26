/**
* @license AGPL-3.0
* @author mojoaxel (https://github.com/mojoaxel)
*/
'use strict';
import './Links.scss'

import React from 'react'

/**
 * normal Link.
 */
let NormalLink = (props) => (
  <a
    role="link"
    href={ props.href }
    title={ props.title || '' }
    {...props}>
      { props.children }
  </a>
)
NormalLink.propTypes = {
  children: React.PropTypes.node.isRequired,
  href: React.PropTypes.string.isRequired,
  title: React.PropTypes.string
};

/**
 * Link to external page.
 */
let ExternalLink = (props) => (
  <NormalLink
    className="external"
    target="_blank"
    {...props}>
      { props.children }
  </NormalLink>
);
ExternalLink.propTypes = NormalLink.propTypes;

/**
 * Link to file to download
 */
let DownloadLink = (props) => (
  <ExternalLink
    className="download"
    {...props}>
      { props.children }
  </ExternalLink>
);
DownloadLink.propTypes = NormalLink.propTypes;

module.exports = {
  NormalLink: NormalLink,
  ExternalLink: ExternalLink,
  DownloadLink: DownloadLink
}
