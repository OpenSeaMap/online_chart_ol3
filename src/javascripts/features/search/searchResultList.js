/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict'

import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { ListGroup } from 'react-bootstrap'

import { SearchResultDisplay } from './searchResultDisplay'

import {
  searchResultHovered,
  searchResultUnhover,
  searchResultClicked
} from '../../store/actions'
import {
  SEARCH_STATE_IDLE,
  SEARCH_STATE_RUNNING,
  SEARCH_STATE_COMPLETE,
  SEARCH_STATE_ERROR,
  SEARCH_STATES
} from '../../store/reducers'

const ResultList = ({
  clickedId, hoveredId,
  onResultClicked, onResultHovered, onResultUnhover,
  results, searchState
}) => {
  switch (searchState) {
    case SEARCH_STATE_IDLE:
      return (
        <FormattedMessage id='search-start-for-results' />
      )
    case SEARCH_STATE_RUNNING:
      return (
        <FormattedMessage id='search-running' />
      )
    case SEARCH_STATE_COMPLETE:
      if (results.length === 0) {
        return (
          <FormattedMessage id='search-empty-result' />
        )
      }
      return (
        <div>
          <h2>
            <FormattedMessage
              id='search-results'
              values={{numberResults: results.length}} />
          </h2>
          <ListGroup>
            {results.map(result => (
              <SearchResultDisplay
                key={result.place_id}

                isClicked={result.place_id === clickedId}
                isHovered={result.place_id === hoveredId}
                onResultClicked={() => { onResultClicked(result.place_id) }}
                onResultHovered={() => { onResultHovered(result.place_id) }}
                onResultUnhover={onResultUnhover}
                result={result} />
              ))
            }
          </ListGroup>
        </div>
      )
    case SEARCH_STATE_ERROR:
      return (
        <FormattedMessage
          id='search-error'
          values={{message: results}} />
      )
  }
  return null
}

ResultList.propTypes = {
  clickedId: PropTypes.string,
  hoveredId: PropTypes.string,
  onResultClicked: PropTypes.func.isRequired,
  onResultHovered: PropTypes.func.isRequired,
  onResultUnhover: PropTypes.func.isRequired,
  results: PropTypes.arrayOf(PropTypes.object).isRequired,
  searchState: PropTypes.oneOf(SEARCH_STATES)
}

const mapStateToProps = (state) => {
  return {
    results: state.search.response,
    searchState: state.search.state,
    hoveredId: state.search.hoveredFeatureId,
    clickedId: state.search.clickedFeatureId
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onResultClicked: (featureId) => {
      dispatch(searchResultClicked(featureId))
    },
    onResultHovered: (featureId) => {
      dispatch(searchResultHovered(featureId))
    },
    onResultUnhover: () => {
      dispatch(searchResultUnhover())
    }
  }
}

const SearchResultList = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResultList)

export default SearchResultList
