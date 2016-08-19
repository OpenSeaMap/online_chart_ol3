/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
* @author mojoaxel (https://github.com/mojoaxel)
*/
'use strict'

var $ = require('jquery')
import React, { PropTypes } from 'react'
import LanguageCodePropTypes from '../../propTypes/langCodes'
import { Button, Input, Glyphicon, ProgressBar, Label } from 'react-bootstrap'

class TagInfo extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      details: null,
      detailsLoading: false,
      extended: false
    }

    this.render = this.render.bind(this)
    this.toggleDetails = this.toggleDetails.bind(this)
  }

  filterForLang (data, langCode) {
    return data.find((d) => {
      return d.lang === langCode
    })
  }

  toggleDetails () {
    this.setState({
      extended: !this.state.extended
    })
    if (!this.state.details) {
      this.setState({
        detailsLoading: true
      })

      $.getJSON('//taginfo.openstreetmap.org/api/4/' + 'tag/wiki_pages?' + 'key=' + this.props.tag.key + '&value=' + this.props.tag.value, function (data) {
        let langData = this.filterForLang(data.data, this.props.locales)
        this.setState({
          details: langData,
          detailsLoading: false
        })
      }.bind(this))
    }
  }

  render () {
    const {tag} = this.props
    const btnStyle = this.state.extended
      ? this.state.detailsLoading
        ? 'warning' : 'primary' : 'default'

    const loading = (
      <ProgressBar
        active
        now={100} />)

    const displayInfo = (
      <Label>
        { this.state.details != null ? this.state.details.description : 'invalid' }
      </Label>)

    const details = this.state.extended
      ? this.state.detailsLoading
        ? loading : displayInfo : null

    return (
      <form>
        <Input
          addonBefore={tag.key}
          buttonAfter={(
            <Button
              bsStyle={btnStyle}
              onClick={this.toggleDetails}>
              <Glyphicon glyph="info-sign" />
            </Button>
          )}
          readOnly
          type="text"
          value={tag.value} />
        { details }
      </form>
      )
  }
}

TagInfo.propTypes = {
  locales: LanguageCodePropTypes.iso638_1,
  tag: PropTypes.shape({
    key: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  }).isRequired
}

module.exports = TagInfo
