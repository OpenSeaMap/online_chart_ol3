/**
* @license AGPL-3.0
* @author mojoaxel (https://github.com/mojoaxel)
*/
'use strict';

import OL3Control from './OL3Control'
import ol from 'openlayers'

class OL3Attribution extends OL3Control {
  _createControl() {
    return this._control = new ol.control.Attribution({
      target: this._element,
      collapsible: false
    })
  }
}

export default OL3Attribution;
