/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict';

import React, { PropTypes } from 'react'
import ol from 'openlayers'
import SidebarStore from './SidebarStoreWrapper'
import { positionsEqual } from './utils'

class Map extends React.Component {

  constructor(props) {
    super(props);
    this.updateView = this.updateView.bind(this)
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

      if (layer.interactions && layer.interactions.length > 0)
        layer.interactions.forEach(interaction => {
          interactions.push(interaction);
        })
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
      target: this.map.getTargetElement()
    }));

    this.map.on('moveend', function() {
      this.map.beforeRender();
      this.updateView();
    }.bind(this));

    this.map.getView().on('change:resolution', function() {
      this.map.beforeRender();
      this.updateView();
    }.bind(this));
  }
  componentWillReceiveProps(nextProps) {
    this.context.layers.forEach((layer) => {
      layer.layer.setVisible(nextProps.layerVisiblility[layer.index]);
    });

    var centre = ol.proj.transform(this.map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326');
    let position = {
      lon: centre[0],
      lat: centre[1],
      zoom: this.map.getView().getZoom()
    }
    if (!positionsEqual(nextProps.viewPosition, position)) {
      let view = this.map.getView();
      let start = +new Date();
      let pan = ol.animation.pan({
        duration: 1000,
        easing: ol.easing.linear,
        source: view.getCenter(),
        start: start
      });
      var bounce = ol.animation.bounce({
        duration: 1000,
        resolution: 2 * view.getResolution(),
        start: start
      });
      this.map.beforeRender(pan, bounce);

      view.setCenter(ol.proj.fromLonLat([
        nextProps.viewPosition.lon,
        nextProps.viewPosition.lat
      ]));
      view.setZoom(nextProps.viewPosition.zoom);
    }
  }

  updateView() {
    var centre = ol.proj.transform(this.map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326');
    let position = {
      lon: centre[0],
      lat: centre[1],
      zoom: this.map.getView().getZoom()
    }
    if (positionsEqual(position, this.props.viewPosition))
      return;
    this.props.onViewPositionChange(position)
  }

  render() {
    return (
      <div
        className="sidebar-map reset-box-sizing"
        ref={ (c) => this._input = c }>
        <SidebarStore
          ref={ (c) => this._sidebar = c }
          tabs={ this.props.sidebar_tabs } />
        { this.props.children }
      </div>
    )
  }
}

Map.defaultProps = {
  renderer: 'dom'
}

import { LayerType } from './chartlayer'
import { SidebarTabType } from './Sidebar'

Map.propTypes = {
  children: PropTypes.node,
  layerVisiblility: PropTypes.object.isRequired,
  onViewPositionChange: PropTypes.func.isRequired,
  renderer: PropTypes.string,
  sidebar_tabs: SidebarTabType.isRequired,
  viewPosition: PropTypes.shape({
    lon: PropTypes.number,
    lat: PropTypes.number,
    zoom: PropTypes.number
  })
}
Map.contextTypes = {
  layers: PropTypes.arrayOf(
    LayerType.isRequired
  ).isRequired
}
module.exports = Map;
