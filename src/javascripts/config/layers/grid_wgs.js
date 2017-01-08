/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict'

import ol from 'openlayers'
import ChartLayer from '../chartlayer'
import orderIds from '../layerOrderNumbers'

import { defineMessages } from 'react-intl'
export const messages = defineMessages({
  layerName: {
    id: 'layer-name-grid-wgs',
    defaultMessage: 'Coordinate grid'
  }
})

// maps the number of degrees spanned by the current view (A)
// onto the distance of the gird lines to be displayed (B)
// both numbers are in degrees (decimal)
const mapDeltaTotalToStep = new Map([
  // [A, B]
  [100, 20],
  [50, 10],
  [25, 5],
  [10, 2],
  [5, 1],
  [2.5, 30 / 60],
  [0.75, 10 / 60],
  [0.25, 5 / 60],
  [0.075, 1 / 60],
  [0.02, 0.5 / 60],
  [0, 0.1 / 60]
])

const getLabelText = function (value, stepSize) {
  const degree = Math.floor(value)
  const degreeString = degree + '°'
  if (stepSize >= 1) return degreeString
  const minutes = (value - degree) * 60
  const numMinuteDecimals = stepSize * 60 >= 1 ? 0 : stepSize * 60 >= 0.1 ? 1 : 2
  const minuteString = minutes.toFixed(numMinuteDecimals) + '\''
  return degreeString + ' ' + minuteString
}

module.exports = function (context, options) {
  let gridLoader = function (extent, resolution, projection) {
    this.clear()
    const epsg4326Extent = ol.proj.transformExtent(extent, projection, 'EPSG:4326')

    const lonMin = Number(epsg4326Extent[0])
    const lonMax = Number(epsg4326Extent[2])
    const latMin = Number(epsg4326Extent[1])
    const latMax = Number(epsg4326Extent[3])

    const lonDeltaTotal = lonMax - lonMin
    let lonDelta
    for (const [delta, step] of mapDeltaTotalToStep) {
      if (lonDeltaTotal < delta) continue
      lonDelta = step
      break
    }

    const latDeltaTotal = latMax - latMin
    let latDelta
    for (const [delta, step] of mapDeltaTotalToStep) {
      if (latDeltaTotal < delta) continue
      latDelta = step
      break
    }

    const stepSize = Math.max(latDelta, lonDelta)

    const lonStart = Math.floor(lonMin / stepSize) * stepSize
    const lonEnd = Math.ceil(lonMax / stepSize) * stepSize

    let lines = []
    for (let lon = lonStart; lon <= lonEnd; lon += stepSize) {
      const p1 = ol.proj.fromLonLat([lon, latMin])
      const p2 = ol.proj.fromLonLat([lon, latMax])

      let feature = new ol.Feature({
        geometry: new ol.geom.LineString([p1, p2]),
        labelPoint: new ol.geom.Point(p2),
        labelText: getLabelText(lon, stepSize),
        featureType: 'lon'
      })
      lines.push(feature)
    }

    const latStart = Math.floor(latMin / stepSize) * stepSize
    const latEnd = Math.ceil(latMax / stepSize) * stepSize
    for (let lat = latStart; lat <= latEnd; lat += stepSize) {
      const p1 = ol.proj.fromLonLat([lonMin, lat])
      const p2 = ol.proj.fromLonLat([lonMax, lat])

      let feature = new ol.Feature({
        geometry: new ol.geom.LineString([p1, p2]),
        labelPoint: new ol.geom.Point(p2),
        labelText: getLabelText(lat, stepSize),
        featureType: 'lat'
      })
      lines.push(feature)
    }
    this.addFeatures(lines)
  }

  let source = new ol.source.Vector({
    loader: gridLoader,
    strategy: ol.loadingstrategy.bbox
  })

  // delete all cached lines on zoom change
  let oldZoom = context.getState().viewPosition.position.zoom
  let storeChangeHandler = function () {
    let state = context.getState()
    if (!state.viewPosition.position) return
    if (oldZoom === state.viewPosition.position.zoom) return
    oldZoom = state.viewPosition.position.zoom
    source.clear()
  }
  context.subscribe(storeChangeHandler)

  const lineStrokeStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({color: '#888'})
  })
  const textStrokeStyle = new ol.style.Stroke({color: 'rgba(255,255,255,0.8)', width: 3})
  const textFillStyle = new ol.style.Fill({color: '#444'})
  const font = '12px sans-serif'

  const styleFunction = function (feature) {
    const labelText = feature.get('labelText')
    const featureType = feature.get('featureType')
    let textStyle
    if (featureType === 'lon') {
      textStyle = new ol.style.Style({
        geometry: 'labelPoint',
        text: new ol.style.Text({
          text: labelText,
          textAlign: 'left',
          textBaseline: 'top',
          offsetX: 2,
          offsetY: 1,
          font: font,
          stroke: textStrokeStyle,
          fill: textFillStyle
        })
      })
    } else {
      textStyle = new ol.style.Style({
        geometry: 'labelPoint',
        text: new ol.style.Text({
          text: labelText,
          textAlign: 'right',
          textBaseline: 'bottom',
          offsetX: 0,
          offsetY: 0,
          font: font,
          stroke: textStrokeStyle,
          fill: textFillStyle
        })
      })
    }
    return [lineStrokeStyle, textStyle]
  }

  var defaults = {
    nameKey: 'layer-name-grid-wgs',
    layer: new ol.layer.Vector({
      source: source,
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      renderBuffer: 0,
      style: styleFunction,
      zIndex: orderIds.grid
    })
  }
  return new ChartLayer(context, Object.assign(defaults, options))
}
