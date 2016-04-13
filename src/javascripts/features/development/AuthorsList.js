/**
* @license AGPL-3.0
* @author mojoaxel (https://github.com/mojoaxel)
*/
'use strict';

import React from 'react'

class AuthorsList extends React.Component {
  render() {
    var authors = this.props.authors;
    return (
      <ul className="authorsList">
        { authors.map((author, i) =>
          <li key={ i }><a href={ author.url }>{ author.name }</a></li>
        ) }
      </ul>
    )
  }
}

AuthorsList.propTypes = {
  authors: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
}

export default AuthorsList
