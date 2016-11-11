/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict'

import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { FormattedMessage } from 'react-intl'
import {FormGroup, FormControl, ControlLabel} from 'react-bootstrap'

import { downloadSetFilter } from 'store/actions'

export const DownloadFilterControl = ({features, setFilter, filter}) => {
  let types = new Map([['- all -', '.*']])
  for (let feature of features) {
    types.set(feature.format, '^' + feature.format + '$')
  }
  return (
    <FormGroup controlId='formControlsSelect'>
      <ControlLabel>
        <FormattedMessage
          id='download-choose-type'
          defaultMessage='Download type:' />
      </ControlLabel>
      <FormControl
        componentClass='select'
        value={filter.format}
        onChange={setFilter}>
        {
          [...types].map(type => (
            <option
              key={type[0]}
              value={type[1]}
              >
              {type[0]}
            </option>
          ))
        }
      </FormControl>
    </FormGroup>
  )
}

DownloadFilterControl.propTypes = {
  features: PropTypes.arrayOf(PropTypes.object).isRequired,
  setFilter: PropTypes.func.isRequired,
  filter: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    features: state.downloadBundles.features,
    filter: state.downloadBundles.filter
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setFilter: (event) => {
      dispatch(downloadSetFilter({ format: event.target.value }))
    }
  }
}

const DownloadFilter = connect(
  mapStateToProps,
  mapDispatchToProps
)(DownloadFilterControl)

export default DownloadFilter
