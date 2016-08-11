/**
* @license AGPL-3.0
* @author mojoaxel (https://github.com/mojoaxel)
*/
'use strict';

import React from 'react'
import SearchBar from './searchBar'
import SearchProvider from './searchProvider'
import SearchResultList from './searchResultList'

class SearchTabControl extends React.Component {
  render() {
    return (
      <div>
        <SearchBar />
        <SearchProvider />
        <SearchResultList />
      </div>
    );
  }
}

SearchTabControl.propTypes = {

}

export default SearchTabControl
