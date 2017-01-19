/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict'

import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { PanelGroup } from 'react-bootstrap'

import { DownloadDisplay } from './downloadDisplay'

import {
  downloadHovered,
  downloadUnhover,
  downloadClicked,
  downloadFeatureMatchesFilter
} from '../../store/actions'

const ResultList = ({
  clickedId, hoveredId,
  onResultClicked, onResultHovered, onResultUnhover,
  features
}) => (
  <div>
    <PanelGroup>
      {features.map(feature => (
        <DownloadDisplay
          key={feature._id}

          isClicked={feature._id === clickedId}
          isHovered={feature._id === hoveredId}
          onResultClicked={() => { onResultClicked(feature._id) }}
          onResultHovered={() => { onResultHovered(feature._id) }}
          onResultUnhover={onResultUnhover}
          feature={feature} />
              ))
            }
    </PanelGroup>
  </div>
      )

ResultList.propTypes = {
  clickedId: PropTypes.number,
  hoveredId: PropTypes.number,
  onResultClicked: PropTypes.func.isRequired,
  onResultHovered: PropTypes.func.isRequired,
  onResultUnhover: PropTypes.func.isRequired,
  features: PropTypes.arrayOf(PropTypes.object).isRequired
}

const mapStateToProps = (state) => {
  let filteredFeatures = []
  for (const f of state.downloadBundles.features) {
    if (!downloadFeatureMatchesFilter(f, state.downloadBundles.filter)) continue
    filteredFeatures.push(f)
  }
  return {
    features: filteredFeatures,
    hoveredId: state.downloadBundles.hoveredFeatureId,
    clickedId: state.downloadBundles.clickedFeatureId
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onResultClicked: (featureId) => {
      dispatch(downloadClicked(featureId))
    },
    onResultHovered: (featureId) => {
      dispatch(downloadHovered(featureId))
    },
    onResultUnhover: () => {
      dispatch(downloadUnhover())
    }
  }
}

const DownloadResultList = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResultList)

export default DownloadResultList
