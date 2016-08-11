/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict';

import React from 'react'
import { PropTypes } from 'react'
//import { FormattedMessage } from 'react-intl';

import { ListGroupItem } from 'react-bootstrap';

export const SearchResultDisplay = ({
  isClicked, isHovered,
  onResultClicked, onResultHovered, onResultUnhover,
  result
}) => (
  <ListGroupItem
      active={isClicked}
      bsStyle={isHovered ? 'info' : ''}
      onClick={onResultClicked}
      onMouseOut={onResultUnhover}
      onMouseOver={onResultHovered}
  >
    {result.display_name}
  </ListGroupItem>
)

SearchResultDisplay.propTypes = {
  isClicked: PropTypes.bool.isRequired,
  isHovered: PropTypes.bool.isRequired,
  onResultClicked: PropTypes.func.isRequired,
  onResultHovered: PropTypes.func.isRequired,
  onResultUnhover: PropTypes.func.isRequired,
  result: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.array,
    PropTypes.number,
  ]))
}
