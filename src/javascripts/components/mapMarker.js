/**
* @license AGPL-3.0
* @author aAXEe (https://github.com/aAXEe)
*/
'use strict'
import Marker from './mapMarker.svg'
var ol = require('openlayers')

const maxWidth = 48
const maxHeight = 48

const img = document.createElement('IMG')
img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(Marker)
const imgSize = [img.naturalWidth, img.naturalHeight]

const scaleWidth = maxWidth / img.naturalWidth
const scaleHeight = maxHeight / img.naturalHeight
const scale = Math.min(scaleWidth, scaleHeight)

module.exports = new ol.style.Style({
  image: new ol.style.Icon({
    anchor: [0.5, 1],
    anchorXUnits: 'fraction',
    anchorYUnits: 'fraction',
    opacity: 1,
    img: img,
    imgSize: imgSize,
    scale: scale
  })
})
