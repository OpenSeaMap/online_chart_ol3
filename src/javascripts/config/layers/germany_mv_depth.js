/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict'

import React from 'react'
import { FormattedMessage } from 'react-intl'
import { ExternalLink } from '../../components/misc/Links'
import controlIds from '../../controls/ol3/controls'
import ol from 'openlayers'
import ChartLayer from '../chartlayer'
import { layerTileLoadStateChange } from '../../store/actions'

module.exports = function (context, options) {
  let source = new ol.source.TileWMS({
    attributions: [
      new ol.Attribution({
        html: 'Depth data Germany/MV © ' +
            '<a href="http://www.geodaten-mv.de/geomis/#94e5ed55-80f9-4af0-b43a-32ca5be7eef9">GeoDaten-MV</a>'
      })
    ],
    url: '//www.geodaten-mv.de/dienste/tiefenkarten_seen_wms?lang=ger&',
    params: {
      'LAYERS': 'tiefenlinien,uferlinien',
      'TILED': true
    },
    gutter: 0
  })

  source.on(['tileloadstart', 'tileloadend', 'tileloaderror'], function (ev) {
    context.dispatch(layerTileLoadStateChange(options.id, ev))
  })

  var defaults = {
    nameKey: 'layer-name-depth-geodaten_mv',
    layer: new ol.layer.Tile({
      source: source
    }),
    additionalSetup: (
      <div>
        <FormattedMessage
          id='copyright-layer'
          values={{
            source: (
              <ExternalLink href={'http://www.geodaten-mv.de/geomis/#94e5ed55-80f9-4af0-b43a-32ca5be7eef9'}>
                {'Ministerium für Landwirtschaft, Umwelt und Verbraucherschutz M-V, Seenprogramm, 2012'}
              </ExternalLink>
            )
          }} />
      </div>
    ),
    additionalControls: [controlIds.attribution]
  }
  return new ChartLayer(context, Object.assign(defaults, options))
}
