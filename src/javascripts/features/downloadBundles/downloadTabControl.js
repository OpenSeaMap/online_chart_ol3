/**
* @license AGPL-3.0
* @author mojoaxel (https://github.com/mojoaxel)
*/
'use strict'

import React from 'react'
import DownloadFilter from './downloadFilter'
import DownloadResultList from './downloadResultList'

class DownloadTabControl extends React.Component {
  render () {
    return (
      <div>
        <DownloadFilter />
        <DownloadResultList />
      </div>
    )
  }
}

DownloadTabControl.propTypes = {

}

export default DownloadTabControl
