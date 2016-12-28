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
import controlIds from '../../controls/ol3/controls'

import { FormattedMessage, defineMessages } from 'react-intl'
export const messages = defineMessages({
  layerName: {
    id: 'layer-name-base-vector',
    defaultMessage: 'Vectormap (simplified)'
  }
})

class LayerConfig extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      showBuildings: false,
      useNightMode: false
    }

    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this)
    this.render = this.render.bind(this)
    this.handleToggleBuildings = this.handleToggleBuildings.bind(this)
    this.handleToggleNight = this.handleToggleNight.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    this.props.setShowBuildings(this.state.showBuildings)
    this.props.setUseNightMode(this.state.useNightMode)
  }

  handleToggleBuildings (e) {
    this.setState({ showBuildings: !this.state.showBuildings })
    this.props.setShowBuildings(!this.state.showBuildings)
  }
  handleToggleNight (e) {
    this.setState({ useNightMode: !this.state.useNightMode })
    this.props.setUseNightMode(!this.state.useNightMode)
  }

  render () {
    return (
      <div>
        <OsmToggle
          checked={this.state.showBuildings}
          label={
            <FormattedMessage
              id={'vectorLayer.showBuildings'}
              defaultMessage='Show buildings' />
          }
          layerId='vectorLayer-show-buildings'
          onChange={this.handleToggleBuildings} />
        <OsmToggle
          checked={this.state.useNightMode}
          label={
            <FormattedMessage
              id={'vectorLayer.useNightmode'}
              defaultMessage='Night mode' />
          }
          layerId='vectorLayer-use-nightmode'
          onChange={this.handleToggleNight} />
      </div>
    )
  }
}

LayerConfig.propTypes = {
  setShowBuildings: PropTypes.func.isRequired,
  setUseNightMode: PropTypes.func.isRequired
}

module.exports = function (context, options) {
  var KEY = 'vector-tiles-DdrLAFD'
  var ATTRIBUTION = 'Vector tiles by <a href="https://mapzen.com/">Mapzen</a>; ' +
        'Map data © ' +
  '<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, ' +
  '<a href="http://whosonfirst.mapzen.com">Who’s On First</a> (<a href="http://whosonfirst.mapzen.com#License">License</a>), ' +
  '<a href="http://www.naturalearthdata.com/">Natural Earth</a>, ' +
  '<a href="http://openstreetmapdata.com/">openstreetmapdata.com</a>'

  const baseGrid = ol.tilegrid.createXYZ({maxZoom: 22})
  let source = new ol.source.VectorTile({
    attributions: [new ol.Attribution({html: ATTRIBUTION})],
    format: new ol.format.MVT({
      layers: ['earth', 'water', 'landuse', 'roads', 'buildings', 'boundaries']
    }),
    tileGrid: baseGrid,
    tilePixelRatio: 16,
    url: 'https://tile.mapzen.com/mapzen/vector/v1/all/{z}/{x}/{y}.mvt?api_key=' + KEY
  })
  source.on(['tileloadstart', 'tileloadend', 'tileloaderror'], function (ev) {
    context.dispatch(layerTileLoadStateChange(options.id, ev))
  })

  const staticStyles = {
    day: {
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
      },
      boundaries: {
        country: {
          lines: new ol.style.Style({stroke: new ol.style.Stroke({color: '#973c00', width: 1})})
        },
        region: {
          lines: {
            style: new ol.style.Style({stroke: new ol.style.Stroke({color: '#973c00', width: 0.5})}),
            min_zoom: 7
          }
        }
      }
    },
    night: {
      earth: {
        earth: {
          polygons: new ol.style.Style({fill: new ol.style.Fill({color: '#24303e'})})
        }
      },
      water: {
        '.*': {
          polygons: new ol.style.Style({fill: new ol.style.Fill({color: '#17233c'})}),
          lines: new ol.style.Style({stroke: new ol.style.Stroke({color: '#17233c', width: 2})})
        }
      },
      roads: {
        highway: { lines: new ol.style.Style({ stroke: new ol.style.Stroke({color: '#353f4d', width: 1}) }) },
        major_road: { lines: new ol.style.Style({ stroke: new ol.style.Stroke({color: '#353f4d', width: 0.8}) }) },
        minor_road: { lines: new ol.style.Style({ stroke: new ol.style.Stroke({color: '#353f4d', width: 0.5}) }) },
        rail: { lines: new ol.style.Style({ stroke: new ol.style.Stroke({color: '#353f4d', width: 0.8, lineDash: [5, 5]}) }) }
      },
      landuse: {
        'urban_area|urban|residential|commercial|industrial': {
          polygons: new ol.style.Style({fill: new ol.style.Fill({color: '#1e2835'})})
        },
        'allotments|camp_site|caravan_site|farm|farmland|farmyard|garden|golf_course|grass|grave_yard|meadow|park|picnic_site|plant|scrub|village_green': {
          polygons: new ol.style.Style({fill: new ol.style.Fill({color: '#1e3132'})})
        },
        'forest|national_park|natural_.*|wood': {
          polygons: new ol.style.Style({fill: new ol.style.Fill({color: '#1e312b'})})
        }
      },
      buildings: {
        'building|building_part': {
          polygons: new ol.style.Style({fill: new ol.style.Fill({color: '#171f27'})})
        }
      },
      boundaries: {
        country: {
          lines: new ol.style.Style({stroke: new ol.style.Stroke({color: '#973c00', width: 1})})
        },
        region: {
          lines: {
            style: new ol.style.Style({stroke: new ol.style.Stroke({color: '#973c00', width: 0.5})}),
            min_zoom: 7
          }
        }
      }
    }
  }

  let showBuildings = false
  let mapMode = 'day'
  function styleFunc (feature, resolution) {
    const z = baseGrid.getZForResolution(resolution)
    var featureLayer = feature.get('layer')
    var featureKind = feature.get('kind')
    var featureGeom = feature.getGeometry().getType()
    const minZ = feature.get('min_zoom')
    if (minZ && minZ > z) return
    // console.log('=============>>> feature', ol.getUid(feature), feature, resolution, featureGeom)

    for (let styleMode in staticStyles) {
      if (mapMode !== styleMode) continue
      let stylesLayer = staticStyles[styleMode]
      for (let layer in stylesLayer) {
        if (layer !== featureLayer) continue
        if (!showBuildings && layer === 'buildings') continue
        let stylesKind = stylesLayer[layer]

        for (var kind in stylesKind) {
          if (!new RegExp(kind).test(featureKind)) continue
          let stylesType = stylesKind[kind]

          for (let geomType in stylesType) {
            if (featureGeom === 'Polygon' && geomType !== 'polygons') continue
            if (featureGeom === 'MultiPolygon' && geomType !== 'polygons') continue

            if (featureGeom === 'LineString' && geomType !== 'lines') continue
            if (featureGeom === 'MultiLineString' && geomType !== 'lines') continue

            if (featureGeom === 'Point' && geomType !== 'points') continue
            if (featureGeom === 'MultiPoint' && geomType !== 'points') continue

            const minZ = stylesType[geomType].min_zoom
            const style = stylesType[geomType].style || stylesType[geomType]

            if (minZ && minZ > z) continue

            return style
          }
        }
      }
    }
  }

  const renderOrderer = (f1, f2) => {
    return f1.get('sort_rank') - f2.get('sort_rank')
  }

  const baseLayer = new ol.layer.VectorTile({
    projection: 'EPSG:4326',
    source: source,
    renderOrder: renderOrderer,
    preload: 6,
    style: styleFunc
  })

  function setShowBuildings (show) {
    if (showBuildings === show) return
    showBuildings = show
    baseLayer.changed()
  }
  function setUseNightMode (activate) {
    const newMode = activate ? 'night' : 'day'
    if (newMode === mapMode) return
    mapMode = newMode
    baseLayer.changed()
  }

  // --- show labels by using ol.layer.Vector

  // return the url to get the tile at [z, x, -y]
  function tileUrlFunction (tileCoord) {
    return ('https://tile.mapzen.com/mapzen/vector/v1/places/{z}/{x}/{y}.json?api_key=' + KEY)
              .replace('{z}', String(tileCoord[0]))
              .replace('{x}', String(tileCoord[1]))
              .replace('{y}', String(-tileCoord[2]))
  }
  // xyz grid for tile access
  const labelGrid = ol.tilegrid.createXYZ({maxZoom: 22})

  // return the url to be fetched to get the data inside the resoultion area
  function mapExtentToTile (extent, resoltuion) {
    let coords = []
    labelGrid.forEachTileCoord(extent, labelGrid.getZForResolution(resoltuion), (coord) => {
      coords.push(coord)
    })
    const coord = coords[0]
    return tileUrlFunction(coord)
  }

  let sourceLabels = new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    url: mapExtentToTile,
    strategy: ol.loadingstrategy.tile(labelGrid)
  })

  sourceLabels.on(['tileloadstart', 'tileloadend', 'tileloaderror'], function (ev) {
    context.dispatch(layerTileLoadStateChange(options.id, ev))
  })

  // the locale for the layer
  let mapLocale = context.getState().locale

  const textStrokeStyle = new ol.style.Stroke({color: 'rgba(255,255,255,0.8)', width: 2})
  const fontDefault = '12px sans-serif'

  const staticLabelStyles = {
    /* kind = */continent: {
      font: 'small-caps 20px sans-serif',
      fillColor: '#973c00'
    },
    country: {
      font: '14px sans-serif',
      fillColor: '#973c00'
    },
    region: {
      font: '12px sans-serif',
      fillColor: '#973c00'
    },

    locality: {
      font: '12px sans-serif',
      fillColor: '#333'
    },
    neighbourhood: {
      font: '10px sans-serif',
      fillColor: '#333'
    }
  }

  function styleFuncLabels (feature, resolution) {
    const z = labelGrid.getZForResolution(resolution)

    const minZ = feature.get('min_zoom')
    if (minZ && minZ > z) return
    const maxZ = feature.get('max_zoom')
    if (maxZ && maxZ < z) return

    const featureKind = feature.get('kind')
    const name = feature.get('name:' + mapLocale) || feature.get('name')

    let font = fontDefault
    let fillColor = '#444'
    let baseline = 'center'
    let circleRadius = 0
    for (const styleKind in staticLabelStyles) {
      if (featureKind !== styleKind) continue
      const kindStyle = staticLabelStyles[styleKind]

      font = kindStyle.font || font
      fillColor = kindStyle.fillColor || fillColor
      if (featureKind === 'locality') {
        baseline = 'top'
        circleRadius = Math.max(1, Math.round(Math.log10(feature.get('population'))))

        if (z === 8 && feature.get('population') < 50e3) return
        if (z === 9 && feature.get('population') < 25e3) return
        if (z <= 5 && !feature.get('country_capital')) return
      }
      if (z <= 6 && featureKind === 'region') return
      if (z <= 4 && featureKind === 'country' && feature.get('population') < 10e6) return
      break
    }
    if (feature.get('country_capital') && z > 5) {
      font = '600 ' + font
    }

    const textFill = new ol.style.Fill({
      color: fillColor
    })
    const nameElement = new ol.style.Style({
      text: new ol.style.Text({
        text: name,
        textAlign: 'center',
        textBaseline: baseline,
        offsetY: circleRadius * 1.2,
        font: font,
        stroke: textStrokeStyle,
        fill: textFill
      })
    })

    if (featureKind === 'locality') { // display text + dot for cities
      const localityPoint = new ol.style.Style({
        image: new ol.style.Circle({
          radius: circleRadius,
          stroke: textStrokeStyle,
          fill: textFill
        })
      })
      return [localityPoint, nameElement]
    }

    return nameElement
  }

  const labelLayer = new ol.layer.Vector({
    source: sourceLabels,
    style: styleFuncLabels,
    renderOrder: renderOrderer,
    zIndex: 1,
    updateWhileAnimating: false,
    updateWhileInteracting: true
  })

  let oldZ = context.getState().viewPosition.position.zoom
  let storeHandler = function () {
    let state = context.getState()
    if (state.viewPosition.position && state.viewPosition.position.zoom !== oldZ) {
      oldZ = state.viewPosition.position.zoom
      sourceLabels.clear()
      sourceLabels.refresh()
    }
    if (state.locale !== mapLocale) {
      mapLocale = state.locale
      labelLayer.changed()
    }
  }
  context.subscribe(storeHandler)

  var defaults = {
    nameKey: 'layer-name-base-vector',
    layer: new ol.layer.Group({
      layers: [
        baseLayer, labelLayer
      ]
    }),
    additionalSetup: (
      <LayerConfig
        setShowBuildings={setShowBuildings}
        setUseNightMode={setUseNightMode}
      />
    ),
    additionalControls: [controlIds.attribution]
  }
  return new ChartLayer(context, Object.assign(defaults, options))
}
