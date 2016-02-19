'use strict';

import React, {PropTypes} from 'react'
import {FormattedMessage} from 'react-intl';
var ol = require('openlayers');

import Sidebar from './Sidebar'

ol.control.Sidebar = function(element, optOptions) {
  var options = optOptions || {};

  ol.control.Control.call(this, {
    element: element,
    target: options.target
  });
};
ol.inherits(ol.control.Sidebar, ol.control.Control);


class Map extends React.Component{

  constructor(props){
    super(props);

  }

  componentDidMount() {
      var attribution = new ol.control.Attribution({
        collapsible: false
      });

      var defaultControls = ol.control.defaults({
        attribution: false
      });

      var addedControls = new ol.Collection([
        new ol.control.Sidebar(this._sidebar.getDomNode()),
        attribution,
        new ol.control.FullScreen(),
        new ol.control.Zoom(),
        new ol.control.ScaleLine({
          units: 'nautical',
          className: 'ol-scale-line-nautical ol-scale-line'
        }),
        new ol.control.ScaleLine({
          units: 'metric',
          className: 'ol-scale-line-metric ol-scale-line'
        })
      ]);

      var controls = addedControls.extend(defaultControls);

      var layers = [];
      var interactions = ol.interaction.defaults({
        altShiftDragRotate: false,
        pinchRotate: false
      });
      this.context.layers.forEach((layer) => {
        layer.layer.setVisible(this.props.layerVisiblility[layer.index]);
        layers.push(layer.layer);

        if(layer.interactions && layer.interactions.length > 0)
          interactions.push(layer.interactions);
      });


      this.map = new ol.Map({
        renderer: 'dom',
        target: this._input,
        view: new ol.View({
          center: ol.proj.fromLonLat([
            this.props.viewPosition.lon,
            this.props.viewPosition.lat
          ]),
          zoom: this.props.viewPosition.zoom
        }),
        controls: controls,
        layers: layers,
        interactions: interactions
      });
  }
  componentWillReceiveProps(nextProps) {
    this.context.layers.forEach((layer) => {
      layer.layer.setVisible(nextProps.layerVisiblility[layer.index]);
    });
  }
  render() {
    return (
      <div
          className="sidebar-map reset-box-sizing"
          ref={(c) => this._input = c}
      >
        <Sidebar
            ref={(c) => this._sidebar = c}
            tabs={this.props.sidebar_tabs}
        />
        {this.props.children}
      </div>
    )
  }
}

Map.defaultProps = {
  renderer: 'dom',
  viewPosition: {
    lon: 11.48,
    lat: 53.615,
    zoom: 14
  }
}

import {LayerType} from './chartlayer'

Map.propTypes = {
  children: PropTypes.node,
  layerVisiblility: PropTypes.object.isRequired,
  renderer: PropTypes.string,
  sidebar_tabs: Sidebar.propTypes.tabs,
  viewPosition: PropTypes.shape({
    lon: PropTypes.number,
    lat: PropTypes.number,
    zoom:PropTypes.number
  })
}
Map.contextTypes = {
  layers: PropTypes.arrayOf(
    LayerType.isRequired
  ).isRequired
}
module.exports = Map;
