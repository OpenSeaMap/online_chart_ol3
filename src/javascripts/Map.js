'use strict';

import React, {PropTypes} from 'react'
import ol from 'openlayers'
import Sidebar from './Sidebar'

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

      // this is a dummy element that gets the same classes as the sidebar
      // it is used to trigger the css for placing the other controls
      // the real sidebar is placed in an different container to allow event propagation (this is required by react)
      var sidebarLeftDummy = document.createElement('div');
      sidebarLeftDummy.className = 'sidebar-left collapsed';

      // update dummy sidebar container
      let $sidebar = this._sidebar.getJSidebar();
      $sidebar.on('opening', () => {
        sidebarLeftDummy.className = 'sidebar-left'
      })
      $sidebar.on('closing', () => {
        sidebarLeftDummy.className = 'sidebar-left collapsed'
      })

      var addedControls = new ol.Collection([
        new ol.control.Control({ // the dummy has to be the first control, otherwise the css does not work
          element: sidebarLeftDummy
        }),
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

      // this places the sidebar container outside of the openlayers controlled ones
      this.map.addControl(new ol.control.Control({
        element: this._sidebar.getDomNode(),
        target: this.map.getViewport()
      }));
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
