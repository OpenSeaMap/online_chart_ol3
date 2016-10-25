/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict'

import React, { PropTypes } from 'react'
import ol from 'openlayers'
import ChartLayer from '../chartlayer'
import { layerTileLoadStateChange } from '../../store/actions'
import OsmToggle from '../../components/misc/Toggle'
import { FormattedMessage } from 'react-intl'

class LayerConfig extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      showBuildings: false
    }

    this.render = this.render.bind(this)
    this.handleToggleBuildings = this.handleToggleBuildings.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ value: nextProps.query })
  }

  handleToggleBuildings (e) {
    this.setState({ showBuildings: !this.state.showBuildings })
    this.props.setShowBuildings(!this.state.showBuildings)
  }

  render () {
    return (
      <OsmToggle
        checked={this.state.showBuildings}
        label={<FormattedMessage id={'vectorLayer-show-buildings'} />}
        layerId='vectorLayer-show-buildings'
        onChange={this.handleToggleBuildings} />
      )
  }
}

LayerConfig.propTypes = {
  setShowBuildings: PropTypes.func.isRequired
}

module.exports = function (context, options) {
  var KEY = 'vector-tiles-DdrLAFD'
  var ATTRIBUTION = '© <a href="https://mapzen.com/">Mapzen</a> ' +
        '© <a href="http://www.openstreetmap.org/copyright">' +
  'OpenStreetMap contributors</a>'

  let source = new ol.source.VectorTile({
    attributions: [new ol.Attribution({html: ATTRIBUTION})],
    format: new ol.format.MVT({
      layers: ['earth', 'water', 'landuse', 'roads', 'buildings']
    }),
    tileGrid: ol.tilegrid.createXYZ({maxZoom: 22}),
    tilePixelRatio: 16,
    url: 'https://tile.mapzen.com/mapzen/vector/v1/all/{z}/{x}/{y}.mvt?api_key=' + KEY
  })
  source.on(['tileloadstart', 'tileloadend', 'tileloaderror'], function (ev) {
    context.dispatch(layerTileLoadStateChange(options.id, ev))
  })

  const staticStyles = {
    earth: {
      earth: {
        polygons: new ol.style.Style({fill: new ol.style.Fill({color: '#ffe278'})})
      }
    },
    water: {
      '.*': {
        polygons: new ol.style.Style({fill: new ol.style.Fill({color: '#78acd2'})}),
        lines: new ol.style.Style({stroke: new ol.style.Stroke({color: '#78acd2', width: 2})})
      }
    },
    roads: {
      highway: { lines: new ol.style.Style({ stroke: new ol.style.Stroke({color: '#555', width: 1}) }) },
      major_road: { lines: new ol.style.Style({ stroke: new ol.style.Stroke({color: '#777', width: 0.8}) }) },
      minor_road: { lines: new ol.style.Style({ stroke: new ol.style.Stroke({color: '#999', width: 0.5}) }) },
      rail: { lines: new ol.style.Style({ stroke: new ol.style.Stroke({color: '#777', width: 0.8, lineDash: [5, 5]}) }) }
    },
    landuse: {
      'urban_area|urban|residential|commercial|industrial': {
        polygons: new ol.style.Style({fill: new ol.style.Fill({color: '#f1cc45'})})
      },
      'allotments|camp_site|caravan_site|farm|farmland|farmyard|garden|golf_course|grass|grave_yard|meadow|park|picnic_site|plant|scrub|village_green': {
        polygons: new ol.style.Style({fill: new ol.style.Fill({color: '#c7cc45'})})
      },
      'forest|national_park|natural_.*|wood': {
        polygons: new ol.style.Style({fill: new ol.style.Fill({color: '#a9c047'})})
      }
    },
    buildings: {
      'building|building_part': {
        polygons: new ol.style.Style({fill: new ol.style.Fill({color: '#c1ab5b'})})
      }
    }
  }

  let showBuildings = false
  function styleFunc (feature, resolution) {
    var featureLayer = feature.get('layer')
    var featureKind = feature.get('kind')
    var featureGeom = feature.getGeometry().getType()
    // console.log('=============>>> feature', ol.getUid(feature), feature, resolution, featureGeom)

    for (let layer in staticStyles) {
      if (layer !== featureLayer) continue

      if (!showBuildings && layer === 'buildings') continue

      for (var kind in staticStyles[layer]) {
        if (!new RegExp(kind).test(featureKind)) continue

        for (let geomType in staticStyles[layer][kind]) {
          if (featureGeom === 'Polygon' && geomType !== 'polygons') continue
          if (featureGeom === 'MultiPolygon' && geomType !== 'polygons') continue

          if (featureGeom === 'LineString' && geomType !== 'lines') continue
          if (featureGeom === 'MultiLineString' && geomType !== 'lines') continue

          if (featureGeom === 'Point' && geomType !== 'points') continue
          if (featureGeom === 'MultiPoint' && geomType !== 'points') continue

          return staticStyles[layer][kind][geomType]
        }
      }
    }
  }

  function setShowBuildings (show) {
    showBuildings = show
    source.refresh()
  }

  var defaults = {
    nameKey: 'layer-name-base-vector',
    layer: new ol.layer.VectorTile({
      projection: 'EPSG:4326',
      source: source,
      renderOrder: (f1, f2) => {
        return f1.get('sort_rank') - f2.get('sort_rank')
      },
      // preload: Infinity,
      style: styleFunc
    }),
    additionalSetup: (
      <LayerConfig
        setShowBuildings={setShowBuildings}
      />
      )
  }
  return new ChartLayer(context, Object.assign(defaults, options))
}
