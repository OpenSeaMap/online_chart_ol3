/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict'

import React, { PropTypes } from 'react'

import { Panel } from 'react-bootstrap'
import { FormattedMessage, FormattedRelative } from 'react-intl'
import { DownloadLink } from '../../components/misc/Links'

export const DownloadDisplay = ({
  isClicked, isHovered,
  onResultClicked, onResultHovered, onResultUnhover,
  feature
}) => (
  <Panel
    bsStyle={isClicked ? 'primary' : isHovered ? 'warning' : 'info'}
    onClick={onResultClicked}
    collapsible expanded={isClicked}
    onMouseOut={onResultUnhover}
    onMouseOver={onResultHovered}
    header={feature.name}>
    <FormattedMessage
      id='download-file-date'
      defaultMessage='Date: {rawDate, date, short} ({formatedRelative})'
      description='Display a file date as a absolute date and a relative timespan'
      values={{
        rawDate: new Date(feature.date),
        formatedRelative: <FormattedRelative value={feature.date} />
      }} />
    <br />
    <FormattedMessage
      id='download-file-format'
      defaultMessage='Format: {format}'
      description='Display a file format name'
      values={{format: feature.format}} />
    <br />
    <FormattedMessage
      id='download-file-application'
      defaultMessage='Application: {app}'
      description='Display an application name'
      values={{app: feature.app}} />
    <br />
    <DownloadLink href={feature.downloadUrl}>
      <FormattedMessage
        id='download-file-download'
        defaultMessage='Download file' />
    </DownloadLink>
  </Panel>

)

DownloadDisplay.propTypes = {
  isClicked: PropTypes.bool.isRequired,
  isHovered: PropTypes.bool.isRequired,
  onResultClicked: PropTypes.func.isRequired,
  onResultHovered: PropTypes.func.isRequired,
  onResultUnhover: PropTypes.func.isRequired,
  feature: PropTypes.object.isRequired
}
