'use strict'

function checkISO639code (languageType) {
  function validate (props, propName, componentName) {
    var propValue = props[propName]
    var errorMsg = 'Invalid prop `' + propName +
      '` supplied to `' + componentName + '`. '

    switch (languageType.toUpperCase()) {
      case 'ISO639-1':
        if (/^[a-zA-Z]{2}$/.test(propValue)) return
        break
      case 'ISO639-2':
        if (/^[a-zA-Z]{3}$/.test(propValue)) return
        break
      default:
        return new Error(errorMsg +
          'Unknown language code type: ' + languageType
        )
    }

    return new Error(errorMsg +
      '"' + propValue + '" is not a valid ' + languageType + ' code.'
    )
  }
  return validate
}

var LanguageCodePropTypes = {
  iso638_1: checkISO639code('ISO639-1'),
  iso638_2: checkISO639code('ISO639-2')
}

module.exports = LanguageCodePropTypes
