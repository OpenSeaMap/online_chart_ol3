/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict';

import React from 'react'
import { connect } from 'react-redux'
import { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl';
import { ListGroup } from 'react-bootstrap';

import { SearchResultDisplay } from './searchResultDisplay';

import {
  searchResultHovered,
  searchResultUnhover,
  searchResultClicked
} from '../../store/actions'

const ResultList = ({
  clickedId, hoveredId,
  onResultClicked, onResultHovered, onResultUnhover,
  results
}) => results.length ? (
  <div>
    <h2><FormattedMessage id="search-results" /></h2>
    <ListGroup>
      {results.map(result => (
        <SearchResultDisplay
            key={result.place_id}

            isClicked={result.place_id === clickedId}
            isHovered={result.place_id === hoveredId}
            onResultClicked={()=>{onResultClicked(result.place_id)}}
            onResultHovered={()=>{onResultHovered(result.place_id)}}
            onResultUnhover={onResultUnhover}
            result={result}
        />
        ))
      }
    </ListGroup>
  </div>
) : (
  <FormattedMessage id="search-start-for-results" />
)

ResultList.propTypes = {
  clickedId: PropTypes.string,
  hoveredId: PropTypes.string,
  onResultClicked: PropTypes.func.isRequired,
  onResultHovered: PropTypes.func.isRequired,
  onResultUnhover: PropTypes.func.isRequired,
  results: PropTypes.arrayOf(PropTypes.object).isRequired
}

const mapStateToProps = (state) => {
  return {
    results: state.search.response,
    hoveredId: state.search.hoveredFeatureId,
    clickedId: state.search.clickedFeatureId,
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
    },
  }
}

const SearchResultList = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResultList)

export default SearchResultList
