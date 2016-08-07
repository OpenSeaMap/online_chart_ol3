/**
* @license AGPL-3.0
* @author mojoaxel (https://github.com/mojoaxel)
*/
'use strict';

import React from 'react'
import SearchBar from './searchBar'
import SearchProvider from './searchProvider'

class SearchTabControl extends React.Component {
  render() {
    return (
      <div>
        <SearchBar />
        <SearchProvider />
      </div>
    );
  }
}

SearchTabControl.propTypes = {

}

export default SearchTabControl
