/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict'

let $ = require('jquery')
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { searchEnd } from 'store/actions'

import {SEARCH_STATE_IDLE, SEARCH_STATE_ERROR, SEARCH_STATE_RUNNING, SEARCH_STATE_COMPLETE} from 'store/reducers'

class SearchProviderComponent extends React.Component {
  constructor (props) {
    super(props)

    this.render = this.render.bind(this)
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this)
    this.onDataReceived = this.onDataReceived.bind(this)
    this.componentWillReceiveProps(props)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.state !== SEARCH_STATE_RUNNING) return

    let args = {
      format: 'json',
      q: nextProps.query,
      polygon_geojson: '1',
      addressdetails: '1',
      extratags: '1',
      namedetails: '1'
    }
    $.getJSON('//nominatim.openstreetmap.org/search', args, this.onDataReceived)
  }

  onDataReceived (data) {
    this.props.onSearchEnd(true, data)
  }

  render () {
    return null
  }
}

SearchProviderComponent.propTypes = {
  onSearchEnd: PropTypes.func.isRequired,
  query: PropTypes.string,
  state: PropTypes.oneOf([SEARCH_STATE_IDLE, SEARCH_STATE_ERROR, SEARCH_STATE_RUNNING, SEARCH_STATE_COMPLETE])
}

const mapStateToProps = (state) => {
  return {
    query: state.search.query,
    state: state.search.state
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSearchEnd: (success, response) => {
      dispatch(searchEnd(success, response))
    }
  }
}

const SearchProvider = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchProviderComponent)

export default SearchProvider
