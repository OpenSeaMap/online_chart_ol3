/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict'

import React, { PropTypes } from 'react'
// import { FormattedMessage } from 'react-intl';

import { ListGroupItem, Collapse } from 'react-bootstrap'
import { FormattedMessage, FormattedDate } from 'react-intl'
import { DownloadLink } from '../../components/misc/Links'

export const DownloadDisplay = ({
  isClicked, isHovered,
  onResultClicked, onResultHovered, onResultUnhover,
  feature
}) => (
  <ListGroupItem
    active={isClicked}
    bsStyle={isHovered && !isClicked ? 'info' : null}
    onClick={onResultClicked}
    onMouseOut={onResultUnhover}
    onMouseOver={onResultHovered} >
    <h4 className='list-group-item-heading'>
      {feature.name}
    </h4>
    <Collapse in={isClicked}>
      <div className='list-group-item-text'>
        <FormattedMessage
          id='download-file-date'
          values={{formatedDate: <FormattedDate value={feature.date} />}} />
        <br />
        <FormattedMessage
          id='download-file-format'
          values={{format: feature.format}} />
        <br />
        <FormattedMessage
          id='download-file-application'
          values={{app: feature.app}} />
        <br />
        <DownloadLink href={feature.downloadUrl}>
          <FormattedMessage
            id='download-file-download' />
        </DownloadLink>
      </div>
    </Collapse>
  </ListGroupItem>

)

DownloadDisplay.propTypes = {
  isClicked: PropTypes.bool.isRequired,
  isHovered: PropTypes.bool.isRequired,
  onResultClicked: PropTypes.func.isRequired,
  onResultHovered: PropTypes.func.isRequired,
  onResultUnhover: PropTypes.func.isRequired,
  feature: PropTypes.object.isRequired
}
