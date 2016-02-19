
import Seamarks from './layers/seamarks'
import OsmBase from './layers/openStreetMapBase'

export function createLayers(context){
  return [
    new OsmBase(context, {
      index: 0,
      visibleDefault: true
    }),
    new Seamarks(context, {
      index: 1,
      visibleDefault: true
    })
  ]
}
