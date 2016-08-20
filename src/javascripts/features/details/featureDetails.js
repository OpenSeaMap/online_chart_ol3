/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict'

var $ = require('jquery')
import TagList from '../../components/tagList/tagList'

const ignoredTags = ['geometry']

const mapStateToProps = (state) => {
  const feature = state.selectedFeature.feature

  let taglist = []
  if (state.selectedFeature.hasFeature) {
    feature.getKeys().forEach(function (key) {
      if ($.inArray(key, ignoredTags) > -1) {
        return
      }
      taglist.push({
        key: key,
        value: feature.get(key)
      })
    })
  }

  return {
    tags: taglist
  }
}

import { connect } from 'react-redux'

const FeatureDetails = connect(
  mapStateToProps
)(TagList)

export default FeatureDetails
