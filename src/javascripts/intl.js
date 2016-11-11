/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict'

import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'
import enStrings from '../../intl/default.json'
import deStrings from '../../intl/de.json'

const localeData = {
  en: enStrings,
  de: deStrings
}

export const allLocales = Object.keys(localeData)

// / returns langCode if this language is supportet, 'en' otherwise
export const getExistingLocaleForCode = (langCode) => {
  return localeData[langCode] ? langCode : 'en'
}

const browserLocale = navigator.language || navigator.browserLanguage
export const defaultLocale = getExistingLocaleForCode(browserLocale)

export const IntlAppProviderInternal = ({locale, children}) => (
  <IntlProvider
    locale={locale}
    key={locale}
    messages={localeData[locale]}>
    { children }
  </IntlProvider>
)

IntlAppProviderInternal.propTypes = {
  locale: PropTypes.oneOf(['de', 'en']),
  children: PropTypes.element
}

const mapStateToProps = (state) => {
  return {
    locale: state.locale
  }
}

const IntlAppProvider = connect(
  mapStateToProps
)(IntlAppProviderInternal)

export default IntlAppProvider
