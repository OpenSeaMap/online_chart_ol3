/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict'

import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import {Form, FormGroup, FormControl, ControlLabel} from 'react-bootstrap'
import { setLocale } from 'store/actions'
import {allLocales} from 'intl'

export const LocaleSwitchControl = ({locale, setLocale}) => (
  <Form componentClass='fieldset' inline>
    <FormGroup controlId='formLocaleSwitch'>
      <ControlLabel>
        <FormattedMessage
          id='locale-switch'
          defaultMessage='Locale:' />
      </ControlLabel>
      {' '}
      <FormControl
        componentClass='select'
        value={locale}
        onChange={setLocale}>
        {
        allLocales.map(type => (
          <option
            key={type}
            value={type}
            >
            {type}
          </option>
        ))
      }
      </FormControl>
    </FormGroup>
  </Form>
)

LocaleSwitchControl.propTypes = {
  locale: PropTypes.string,
  setLocale: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    locale: state.locale
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setLocale: (event) => {
      dispatch(setLocale(event.target.value))
    }
  }
}

const LocaleSwitch = connect(
  mapStateToProps,
  mapDispatchToProps
)(LocaleSwitchControl)

export default LocaleSwitch
