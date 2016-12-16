/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict'

import ol from 'openlayers'
import ChartLayer from '../chartlayer'
import { layerTileLoadStateChange } from '../../store/actions'
import controlIds from '../../controls/ol3/controls'

import { defineMessages } from 'react-intl'
export const messages = defineMessages({
  layerName: {
    id: 'layer-name-elevationProfile',
    defaultMessage: 'Elevation profile'
  }
})

module.exports = function (context, options) {
  const ATTRIBUTION = '<a href="http://srtm.csi.cgiar.org/">SRTM</a>; ASTER GDEM is a product of <a href="http://www.meti.go.jp/english/press/data/20090626_03.html">METI</a> and <a href="https://lpdaac.usgs.gov/products/aster_policies">NASA</a>'

  let sourceHillshade = new ol.source.XYZ({
    attributions: [new ol.Attribution({html: ATTRIBUTION})],
    url: 'http://korona.geog.uni-heidelberg.de/tiles/asterh/?x={x}&y={y}&z={z}', // server does not support https :(
    maxZoom: 15,
    crossOrigin: 'Anonymous'
  })

  sourceHillshade.on(['tileloadstart', 'tileloadend', 'tileloaderror'], function (ev) {
    context.dispatch(layerTileLoadStateChange(options.id, ev))
  })

  let sourceLines = new ol.source.XYZ({
    url: 'http://korona.geog.uni-heidelberg.de/tiles/asterc/?x={x}&y={y}&z={z}', // server does not support https :(
    crossOrigin: 'Anonymous'
  })

  sourceLines.on(['tileloadstart', 'tileloadend', 'tileloaderror'], function (ev) {
    context.dispatch(layerTileLoadStateChange(options.id, ev))
  })

  var defaults = {
    nameKey: 'layer-name-elevationProfile',
    layer: new ol.layer.Group({
      layers: [
        new ol.layer.Tile({
          source: sourceHillshade,
          opacity: 0.5
        }),
        new ol.layer.Tile({
          source: sourceLines,
          maxResolution: 9.55 // zoom 14, see https://msdn.microsoft.com/en-us/library/aa940990.aspx
        })
      ]
    }),
    additionalControls: [controlIds.attribution]
  }
  return new ChartLayer(context, Object.assign(defaults, options))
}
