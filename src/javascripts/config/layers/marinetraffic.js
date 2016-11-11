/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict'

import React from 'react'
import { ClickOnMarkersMessage } from 'utils'
import {TabSidebarDetails} from 'features/tabs'
var $ = require('jquery')
import ol from 'openlayers'
import ChartLayer from '../chartlayer'

import { featureClicked, layerTileLoadStateChange } from '../../store/actions'
import { setSidebarOpen, setSidebarActiveTab } from '../../controls/sidebar/store'
import warning from 'fbjs/lib/warning'

import { defineMessages } from 'react-intl'
export const messages = defineMessages({
  layerName: {
    id: 'layer-name-marinetraffic',
    defaultMessage: 'Marine traffic'
  }
})

const FEATURE_CLICKED_PROPERTY_NAME = '_clicked'
const FEATURE_HOVERED_PROPERTY_NAME = '_hovered'

module.exports = function (context, options) {
  var defaults = {
    nameKey: 'layer-name-marinetraffic'
  }
  Object.assign(defaults, options)

  var styleFunction = function (feature, resolution) {
    let clicked = feature.get(FEATURE_CLICKED_PROPERTY_NAME)
    let hovered = feature.get(FEATURE_HOVERED_PROPERTY_NAME)
    let name = feature.get('SHIPNAME') || feature.get('MMSI')
    let nameElement = new ol.style.Text({
      font: hovered ? 'bold 12px sans-serif' : '10px sans-serif',
      offsetY: 12,
      text: name,
      textAlign: 'center',
      textBaseline: 'top'
    })

    let image = new ol.style.Circle({
      radius: 10,
      fill: new ol.style.Fill({
        color: 'rgba(16, 40, 68, 0.3)'
      }),
      stroke: new ol.style.Stroke({
        color: 'rgba(16, 40, 68, 1)',
        width: hovered || clicked ? 3 : 1
      })
    })

    return new ol.style.Style({
      image: image,
      text: nameElement
    })
  }

  let source = new ol.source.Vector({
    loader: function (extent, resolution, projection) {
      var epsg4326Extent = ol.proj.transformExtent(extent, projection, 'EPSG:4326')

      let apikey = '7b58e3ad9855067acc7404a3199268d929af9287'
      let minlat = epsg4326Extent[1]
      let minlon = epsg4326Extent[0]
      let maxlat = epsg4326Extent[3]
      let maxlon = epsg4326Extent[2]
      var url = 'http://services.marinetraffic.com/api/exportvessels/' +
        `${apikey}/` +
        `MINLAT:${minlat}/MAXLAT:${maxlat}/MINLON:${minlon}/MAXLON:${maxlon}/` +
        'protocol:jsono'

      let corsUrl = '//whateverorigin.org/get?url=' + encodeURIComponent(url) + '&callback=?'

      $.ajax({
        url: corsUrl,
        dataType: 'json',
        success: function (data) {
          let features = []
          let results

          try {
            results = JSON.parse(data.contents)
          } catch (e) {
            warning(0, 'Marine traffic API returned error: "' + data.contents + '"')
            this.dispatchEvent({
              type: 'tileloaderror',
              target: this,
              textStatus: data.contents,
              errorThrown: e
            })
            return
          }
          results.forEach((res) => {
            let featureProps = res
            let labelCoords = ol.proj.fromLonLat([Number(res.LON), Number(res.LAT)])
            featureProps.geometry = new ol.geom.Point(labelCoords)

            let feature = new ol.Feature(featureProps)
                    // feature.setStyle(styleFunction)
            feature.setId(res.MMSI)
            features.push(feature)
          })

          this.addFeatures(features)
          this.dispatchEvent({type: 'tileloadend', target: this})
        },
        error: function (jqXHR, textStatus, errorThrown) {
          this.dispatchEvent({
            type: 'tileloaderror',
            target: this,
            textStatus: textStatus,
            errorThrown: errorThrown
          })
        },
        context: this
      })

      this.dispatchEvent({type: 'tileloadstart', target: this})
    },
    strategy: ol.loadingstrategy.bbox
  })
  source.on(['tileloadstart', 'tileloadend', 'tileloaderror'], function (ev) {
    context.dispatch(layerTileLoadStateChange(options.id, ev))
  })

  let layer = new ol.layer.Vector({
    source: source,
    style: styleFunction
  })

  layer.on('selectFeature', function (e) {
    let feature = e.feature
    feature.set(FEATURE_CLICKED_PROPERTY_NAME, true)
    context.dispatch(featureClicked(feature.getProperties()))
    context.dispatch(setSidebarActiveTab(TabSidebarDetails.name))
    context.dispatch(setSidebarOpen(true))
  })
  layer.on('unselectFeature', function (e) {
    e.feature.set(FEATURE_CLICKED_PROPERTY_NAME, false)
  })

  layer.on('hoverFeature', function (e) {
    let feature = e.feature
    feature.set(FEATURE_HOVERED_PROPERTY_NAME, true)
  })
  layer.on('unhoverFeature', function (e) {
    e.feature.set(FEATURE_HOVERED_PROPERTY_NAME, false)
  })

  var objects = {
    layer: layer,
    isInteractive: true,
    additionalSetup: (
      <div>
        <ClickOnMarkersMessage />
      </div>
    ),
    additionalTab: TabSidebarDetails
  }

  return new ChartLayer(context, Object.assign(defaults, objects))
}
