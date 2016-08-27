/**
* @license AGPL-3.0
* @author mojoaxel (https://github.com/mojoaxel)
*/
'use strict'

import React, { PropTypes } from 'react'
import { ExternalLink } from '../../components/misc/Links'

class AuthorsList extends React.Component {
  render () {
    var authors = this.props.authors
    return (
      <ul className='authorsList'>
        { authors.map((author, i) => (
          <li key={i}>
            <ExternalLink href={author.url}>
              { author.name }
            </ExternalLink>
          </li>
          )) }
      </ul>
    )
  }
}

AuthorsList.propTypes = {
  authors: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    url: PropTypes.string
  })).isRequired
}

export default AuthorsList
