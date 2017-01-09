/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict'

import React, { PropTypes } from 'react'

import { ListGroupItem } from 'react-bootstrap'
import { FormattedMessage, FormattedRelative } from 'react-intl'
import { DownloadLink } from '../../components/misc/Links'

function humanFileSize (bytes, si) {
  var thresh = si ? 1000 : 1024
  if (Math.abs(bytes) < thresh) {
    return bytes + ' B'
  }
  var units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
  var u = -1
  do {
    bytes /= thresh
    ++u
  } while (Math.abs(bytes) >= thresh && u < units.length - 1)
  return bytes.toFixed(1) + ' ' + units[u]
}

export const DownloadDisplay = ({
  feature
}) => (
  <ListGroupItem>
    <h4 className='list-group-item-heading'>
      {feature['name:en']}
    </h4>
    <div className='list-group-item-text'>
      {!isNaN(Date.parse(feature.date))
        ? <FormattedMessage
          id='download-file-date'
          defaultMessage='Date: {rawDate, date, short} ({formatedRelative})'
          description='Display a file date as a absolute date and a relative timespan'
          values={{
            rawDate: new Date(feature.date),
            formatedRelative: <FormattedRelative value={feature.date} />
          }} />
        : <FormattedMessage
          id='download-file-date-unknown'
          defaultMessage='Date: unknown'
          description='Display "date unknown"'
             />
        }
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
      {feature.filesize > 0
          ? <FormattedMessage
            id='download-file-filesize'
            defaultMessage='Size: {size}'
            description='Display the file size'
            values={{size: humanFileSize(feature.filesize, false)}} />
          : <div />
        }
      <br />
      <DownloadLink href={feature.url}>
        <FormattedMessage
          id='download-file-download'
          defaultMessage='Download file' />
      </DownloadLink>
    </div>
  </ListGroupItem>

)

DownloadDisplay.propTypes = {
  feature: PropTypes.object.isRequired
}
