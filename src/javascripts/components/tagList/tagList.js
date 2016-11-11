/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
* @author mojoaxel (https://github.com/mojoaxel)
*/
'use strict'

import React, { PropTypes } from 'react'
import TagInfo from './tagInfo'
import { ClickOnMarkersMessage } from 'utils'
import { FormattedMessage } from 'react-intl'

import './tagList.scss'

const TagList = ({tags}) => (
  <div className='tagList'>
    <h2>
      <FormattedMessage id='heading.tags' defaultMessage='Tags' />
    </h2>
    <ClickOnMarkersMessage />
    { tags.map(tag => (
      <TagInfo
        key={tag.key}
        locales='de'
        tag={tag} />
      )) }
  </div>
)
TagList.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  }).isRequired).isRequired
}
module.exports = TagList
