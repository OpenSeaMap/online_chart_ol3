/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict'

export default {
  // user layers to be displayed under all
  user_under_everything: 0,

  earth: 10,
  water: 20,
  landuse: 30,

  // Under structures like roads and buildings. Above water, landuse, and earth.
  user_under_structures: 290,

  boundaries: 300,
  roads: 305,
  transit: 310,
  buildings: 320,
  grid: 330,

  // above the base mapbut under the labels
  user_overlay: 490,

  shields: 550,
  labels: 560,

  // user layers to be displayed over all other layers
  user_over_all: 999
}
