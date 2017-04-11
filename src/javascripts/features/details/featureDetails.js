/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict'

import { connect } from 'react-redux'
import TagList from '../../components/tagList/tagList'
var $ = require('jquery')

const ignoredTags = ['geometry', '_clicked', '_hovered']

const mapStateToProps = (state) => {
  const feature = state.selectedFeature.feature

  let taglist = []
  if (state.selectedFeature.hasFeature) {
    Object.keys(feature).forEach(function (key) {
      if ($.inArray(key, ignoredTags) > -1) {
        return
      }
      taglist.push({
        key: key,
        value: feature[key]
      })
    })
  }

  return {
    tags: taglist
  }
}

const FeatureDetails = connect(
  mapStateToProps
)(TagList)

export default FeatureDetails
