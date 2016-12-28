/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict'

export default {
  // user layers to be displayed under all
  user_under_everything: 0,

  earth: 10,
  landuse: 20,

  // user layers to displayed above earth and landuse.
  user_under_water: 190,

  water: 200,
  boundaries: 210,

  // Under roads. Above borders, water, landuse, and earth.
  user_under_roads: 290,

  roads: 300,
  transit: 310,
  buildings: 320,
  grid: 330,

  user_overlay: 490,

  shields: 550,
  labels: 560,

    // user layers to be displayed over all other layers
  user_over_all: 999
}
