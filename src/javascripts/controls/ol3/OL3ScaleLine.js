/**
* @license AGPL-3.0
* @author mojoaxel (https://github.com/mojoaxel)
*/
'use strict';

import React from 'react'
import OL3Control from './OL3Control'
import ol from 'openlayers'
import _ from 'lodash'

class OL3ScaleLine extends OL3Control {
  _createControl() {
    return this._control = new ol.control.ScaleLine({
      target: this._element,
      units: this.props.units,
      className: 'ol-scale-line-' + this.props.units + ' ol-scale-line'
    })
  }
}
OL3ScaleLine.PropTypes = _.extend(OL3Control.PropTypes, {
  units: React.PropTypes.string.isRequired
});

export default OL3ScaleLine;
