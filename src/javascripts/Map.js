/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
* @author mojoaxel (https://github.com/mojoaxel
*/
'use strict'

import React, { PropTypes } from 'react'
import ol from 'openlayers'
import { positionsEqual } from './utils'

import MetaControl from './controls/metaControl/MetaControl'
import Sidebar from './controls/sidebar/Sidebar'
import { OL3Attribution, OL3Fullscreen, OL3ScaleLine, OL3Zoom } from './controls/ol3/controls'

import { Tabs } from './features/tabs'

class Map extends React.Component {

  constructor (props) {
    super(props)
    this.updateView = this.updateView.bind(this)
    this.viewIsMoving = false // set to true during animations to prevent position updates

    /* array of controls.
     * this controls must be added/removed from the map.
     *TODO: add functions to all/remove a control at a later time
     */
    this._controls = []
  }

  componentDidMount () {
    var layers = []
    var interactions = ol.interaction.defaults({
      altShiftDragRotate: false,
      pinchRotate: false
    })
    this.context.layers.forEach((layer) => {
      layer.layer.setVisible(!!(this.props.layerVisible[layer.id]))
      layers.push(layer.layer)

      if (layer.interactions && layer.interactions.length > 0) {
        layer.interactions.forEach(interaction => {
          interactions.push(interaction)
        })
      }
    })

    this.ol3Map = new ol.Map({
      renderer: 'dom',
      target: this._input,
      controls: [],
      layers: layers,
      interactions: interactions,
      loadTilesWhileAnimating: true,
      loadTilesWhileInteracting: true,
      view: new ol.View({
        center: ol.proj.fromLonLat([
          this.props.viewPosition.lon,
          this.props.viewPosition.lat
        ]),
        zoom: this.props.viewPosition.zoom
      })
    })

    /* add meta control to the map */
    this.ol3Map.addControl(new ol.control.Control({
      element: this._metaControl.getDomNode(),
      target: this.ol3Map.getTargetElement()
    }))

    /* add all controls to the map */
    this._controls.map((control) => this.ol3Map.addControl(control))

    this.ol3Map.on('moveend', function () {
      this.viewIsMoving = false
      this.ol3Map.beforeRender()
      this.updateView()
    }.bind(this))

    this.ol3Map.getView().on('change:resolution', function () {
      this.viewIsMoving = false
      this.ol3Map.beforeRender()
      this.updateView()
    }.bind(this))
  }

  componentWillReceiveProps (nextProps) {
    this.context.layers.forEach((layer) => {
      layer.layer.setVisible(!!(nextProps.layerVisible[layer.id]))
    })

    var centre = ol.proj.transform(this.ol3Map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326')
    let position = {
      lon: centre[0],
      lat: centre[1],
      zoom: this.ol3Map.getView().getZoom()
    }
    if (!positionsEqual(nextProps.viewPosition, position)) {
      let view = this.ol3Map.getView()
      this.setupMoveAnimations()

      view.setCenter(ol.proj.fromLonLat([
        nextProps.viewPosition.lon,
        nextProps.viewPosition.lat
      ]))
      view.setZoom(nextProps.viewPosition.zoom)
    }

    if (nextProps.viewExtent !== this.props.viewExtent) {
      if (nextProps.viewExtent && nextProps.viewExtent.length === 4) {
        let mapSize = this.ol3Map.getSize()
        let width = mapSize[0]
        let height = mapSize[1]
        let options = {
          padding: [height / 4, width / 4, height / 4, width / 4],
          maxZoom: 18
        }
        this.setupMoveAnimations()
        this.ol3Map.getView().fit(nextProps.viewExtent, mapSize, options)
        this.props.onViewExtentChange([])
        this.viewIsMoving = false
        this.updateView() // trigger state update
      }
    }
  }

  addControlToMap (control) {
    this._controls.push(control)
  }

  setupMoveAnimations () {
    let view = this.ol3Map.getView()
    let start = +new Date()
    let pan = ol.animation.pan({
      duration: 1000,
      easing: ol.easing.inAndOut,
      source: view.getCenter(),
      start: start
    })
    var bounce = ol.animation.zoom({
      duration: 1000,
      easing: ol.easing.inAndOut,
      resolution: view.getResolution(),
      start: start
    })
    this.ol3Map.beforeRender(pan, bounce)
  }

  updateView () {
    if (this.viewIsMoving) return
    var centre = ol.proj.transform(this.ol3Map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326')
    let position = {
      lon: centre[0],
      lat: centre[1],
      zoom: this.ol3Map.getView().getZoom()
    }
    if (positionsEqual(position, this.props.viewPosition)) return
    this.props.onViewPositionChange(position)
  }

  render () {
    let names = new Set()
    let additionalTabs = []
    this.context.layers.forEach(layer => {
      if (!this.props.layerVisible[layer.id]) return
      if (!layer.additionalTab) return
      if (names.has(layer.additionalTab.name)) return
      additionalTabs.push(layer.additionalTab)
      names.add(layer.additionalTab.name)
    })
    return (
      <div
        className="sidebar-map"
        ref={(c) => { this._input = c }}>
        <MetaControl ref={(c) => { this._metaControl = c }}>
          <Sidebar
            id="sidebar"
            position="sidebar left"
            tabs={Tabs.concat(additionalTabs)} />
          <OL3Attribution
            id="ol3-attribution"
            position="bottom right"
            addControlToMap={(c) => this.addControlToMap(c)} />
          <OL3Fullscreen
            id="ol3-fullscreen"
            position="top right"
            addControlToMap={(c) => this.addControlToMap(c)} />
          <OL3Zoom
            id="ol3-zoom"
            position="top left"
            addControlToMap={(c) => this.addControlToMap(c)} />
          <OL3ScaleLine
            id="ol3-scaleline-metric"
            position="bottom left"
            units="metric"
            addControlToMap={(c) => this.addControlToMap(c)} />
          <OL3ScaleLine
            id="ol3-scaleline-nautical"
            position="bottom left"
            units="nautical"
            addControlToMap={(c) => this.addControlToMap(c)} />
        </MetaControl>
      </div>
    )
  }
}

Map.defaultProps = {
  renderer: 'dom'
}

Map.propTypes = {
  layerVisible: PropTypes.objectOf(PropTypes.bool).isRequired,
  onViewExtentChange: PropTypes.func.isRequired,
  onViewPositionChange: PropTypes.func.isRequired,
  renderer: PropTypes.string,
  viewExtent: PropTypes.arrayOf(PropTypes.number),
  viewPosition: PropTypes.objectOf(PropTypes.number)
}

import { LayerType } from './config/chartlayer'

Map.contextTypes = {
  layers: PropTypes.arrayOf(LayerType)
}

export default Map
