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
  <a role="link"
    href={ props.href }
    title={ props.title || ''}
    {...props}>
      { props.children }
  </a>
)
NormalLink.propTypes = {
  href: React.PropTypes.string.isRequired,
  children: React.PropTypes.string.isRequired,
  title: React.PropTypes.string
};
export default NormalLink

/**
 * Link to external page.
 */
export const ExternalLink = (props) => (
  <NormalLink className="external"
    target="_blank"
    {...props}>
      { props.children }
  </NormalLink>
);

/**
 * Link to file to download
 */
export const DownloadLink = (props) => (
  <ExternalLink className="download"
    {...props}>
      { props.children }
  </ExternalLink>
);
