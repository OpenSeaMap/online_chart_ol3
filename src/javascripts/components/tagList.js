'use strict';

import React, {PropTypes} from 'react'
import TagInfo from './tagInfo'
import {FormattedMessage} from 'react-intl';

const TagList = ({tags}) => (
  <div>
    <h2>
      <FormattedMessage id="tags" />
    </h2>
    { tags.map(tag =>
      <TagInfo
          key={tag.key}
          locales="de"
          tag={tag}
      />
    ) }
  </div>
)
TagList.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  }).isRequired).isRequired
}
module.exports = TagList;
