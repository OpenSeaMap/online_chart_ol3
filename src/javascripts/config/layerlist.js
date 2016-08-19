/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
* @author mojoaxel (https://github.com/mojoaxel)
*/
import _ from 'lodash'

import Seamarks from './layers/seamarks'
import OsmBase from './layers/openStreetMapBase'
import Int1Base from './layers/int1base'
import DeMvDepth from './layers/germany_mv_depth'
import ScubaDiving from './layers/scubaDiving'
import SeamarksDebug from './layers/seamarkDebug'
import Search from './layers/search'

/**
for the old (2013) layers format see:
https://github.com/OpenSeaMap/online_chart/blob/master/index.php#L72
var layer_mapnik;                      // 1
var layer_marker;                      // 2
var layer_seamark;                     // 3
var layer_sport;                       // 4
//var layer_gebco_deepshade;             // 5
var layer_gebco_deeps_gwc;             // 6
var layer_pois;                        // 7
var layer_download;                    // 8
var layer_nautical_route;              // 9
var layer_grid;                        // 10
var layer_wikipedia;                   // 11
var layer_bing_aerial;                 // 12
var layer_ais;                         // 13
var layer_satpro;                      // 14
// layer_disaster                        // 15
var layer_tidalscale;                  // 16
var layer_permalink;                   // 17
var layer_waterdepth_trackpoints_100m; // 18
var layer_elevation_profile_contours;  // 19
var layer_elevation_profile_hillshade; // 20
var layer_waterdepth_trackpoints_10m;  // 21
var layer_waterdepth_contours;         // 22
*/

export const availibleBaseLayers = [
  {
    LayerConstructor: OsmBase,
    id: 'base_osm_default',
    isBaseLayer: true,
    urlIndex2013: 1,
    urlIndex2016BaseLayer: 'A',
    visibleDefault: true
  }, {
    LayerConstructor: Int1Base,
    id: 'overlay_intl_base',
    isBaseLayer: true,
    urlIndex2016BaseLayer: 'B',
    visibleDefault: false
  }
]

export const availibleOverlayLayers = [
  {
    LayerConstructor: Seamarks,
    id: 'overlay_osm_seamarks',
    urlIndex2016: 0,
    urlIndex2013: 3,
    visibleDefault: true
  }, {
    LayerConstructor: SeamarksDebug,
    id: 'overlay_osm_seamarks_debug',
    urlIndex2016: 1,
    visibleDefault: false
  }, {
    LayerConstructor: DeMvDepth,
    id: 'overlay_demvdepth',
    urlIndex2016: 2,
    visibleDefault: false
  }, {
    LayerConstructor: ScubaDiving,
    id: 'overlay_osm_scubadiving',
    urlIndex2016: 3,
    urlIndex2013: 4,
    visibleDefault: false
  },
  {
    LayerConstructor: Search,
    id: 'overlay_search',
    urlIndex2016: 4,
    visibleDefault: true
  }
]

export function createLayers (store) {
  let layers = []
  let availibleLayers = availibleBaseLayers.concat(availibleOverlayLayers)
  availibleLayers.forEach(function (layer) {
    layers.push(new layer.LayerConstructor(store, _.omit(layer, 'LayerConstructor')))
  })
  return layers
}
