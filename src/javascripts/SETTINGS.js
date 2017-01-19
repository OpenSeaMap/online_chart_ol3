
export const defaultViewPosition = {
  position: {
    lon: 0,
    lat: 0,
    zoom: 3
  }
}

import controlIds from './controls/ol3/controls'
export const alwaysOnControls = [
  controlIds.zoom, controlIds.fullscreen, controlIds.scaleline_metric
]
