import Seamarks from './layers/seamarks'
import OsmBase from './layers/openStreetMapBase'
import Int1Base from './layers/int1base'
import DeMvDepth from './layers/germany_mv_depth'
//import ScubaDiving from './layers/scubaDiving'
//import SeamarksDebug from './layers/seamarkDebug'

// layers with interaction do currently not work
// the ui can not be updated

export function createLayers(context) {
  return [
    new OsmBase(context, {
      index: 0,
      visibleDefault: true
    }),
    new Int1Base(context, {
      index: 1,
      visibleDefault: false
    }),

    new Seamarks(context, {
      index: 2,
      visibleDefault: true
    }),
/*    new SeamarksDebug(context, {
      index: 3,
      visibleDefault: true
    }),*/

    new DeMvDepth(context, {
      index: 4,
      visibleDefault: true
    })
/*    new ScubaDiving(context, {
      index: 5,
      visibleDefault: true
    })*/
  ]
}

export const defaultViewPosition = {
  lon: 11.48,
  lat: 53.615,
  zoom: 14
}
