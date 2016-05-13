/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
import Seamarks from './layers/seamarks'
import OsmBase from './layers/openStreetMapBase'
import Int1Base from './layers/int1base'
import DeMvDepth from './layers/germany_mv_depth'
import ScubaDiving from './layers/scubaDiving'
//import SeamarksDebug from './layers/seamarkDebug'

// layers with interaction do currently not work
// the ui can not be updated

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

export function createLayers(context) {
  return [
    new OsmBase(context, {
      index2016: 0,
      index2013: 1,
      visibleDefault: true
    }),
    new Int1Base(context, {
      index2016: 1,
      index2013: -1,
      visibleDefault: false
    }),

    new Seamarks(context, {
      index2016: 2,
      index2013: 3,
      visibleDefault: true
    }),
    /*    new SeamarksDebug(context, {
          index2016: 3,
          index2013: 3,
          visibleDefault: true
        }),*/

    new DeMvDepth(context, {
      index2016: 4,
      index2013: -1,
      visibleDefault: false
    }),
    new ScubaDiving(context, {
      index2016: 5,
      index2013: 4,
      visibleDefault: true
    })
  ]
}

export const defaultViewPosition = {
  lon: 11.48,
  lat: 53.615,
  zoom: 14
}
