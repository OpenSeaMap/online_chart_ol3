/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict'

import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import {FormGroup, InputGroup, FormControl, Button} from 'react-bootstrap'
import MdSearch from 'react-icons/lib/md/search'
import MdClear from 'react-icons/lib/md/clear'

import { searchStart, searchClear } from 'store/actions'
import { setSidebarOpen, setSidebarActiveTab } from 'controls/sidebar/store'

import {SearchTab} from 'config/layers/search'
import {SEARCH_STATE_IDLE, SEARCH_STATE_ERROR, SEARCH_STATE_RUNNING, SEARCH_STATE_COMPLETE} from 'store/reducers'

class SearchBarComponent extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      value: ''
    }

    this.render = this.render.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleClear = this.handleClear.bind(this)
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this)
    this.getValidationState = this.getValidationState.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ value: nextProps.query })
  }

  handleChange (e) {
    this.setState({ value: e.target.value })
  }

  handleSubmit (e) {
    e.preventDefault()
    this.props.onSearchSubmit(this.state.value)
  }
  handleClear (e) {
    e.preventDefault()
    this.props.onSearchClear()
  }

  getValidationState () {
    const state = this.props.state
    if (state === SEARCH_STATE_COMPLETE) return 'success'
    else if (state === SEARCH_STATE_RUNNING) return 'warning'
    else if (state === SEARCH_STATE_ERROR) return 'error'
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <FormGroup validationState={this.getValidationState()} >
          <InputGroup>
            <FormControl
              onChange={this.handleChange}
              placeholder='Enter text'
              type='text'
              value={this.state.value} />
            <InputGroup.Button>
              <Button onClick={this.handleSubmit}><MdSearch /></Button>
              <Button onClick={this.handleClear}><MdClear /></Button>
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>
      </form>
      )
  }
}

SearchBarComponent.propTypes = {
  onSearchClear: PropTypes.func.isRequired,
  onSearchSubmit: PropTypes.func.isRequired,
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
    onSearchSubmit: (query) => {
      dispatch(searchStart(query))

      dispatch(setSidebarActiveTab(SearchTab.name))
      dispatch(setSidebarOpen(true))
    },
    onSearchClear: () => {
      dispatch(searchClear())
    }
  }
}

const SearchBar = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchBarComponent)

export default SearchBar
