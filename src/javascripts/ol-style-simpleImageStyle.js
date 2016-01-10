'use strict';
var ol = require('openlayers');
var loadImage = require('loadimage');

module.exports = function(imageSrc, maxWidth, maxHeight) {
  var icon = new ol.style.Icon({
    anchor: [0.5, 0.5],
    anchorXUnits: 'fraction',
    anchorYUnits: 'fraction',
    opacity: 0.75,
    src: imageSrc
  });
  var iconStyle = new ol.style.Style({
    image: icon
  });

  /* Workaround for https://github.com/openlayers/ol3/issues/2720
    Load the target image and determine the image size. Than scale the ol.Style.Icon.
    */
  loadImage(imageSrc, function(img) {
    var width = img.width;
    var scaleWidth = maxWidth / width;
    var height = img.height;
    var scaleHeight = maxHeight / height;
    var scale = Math.min(scaleWidth, scaleHeight);

    icon.setScale(scale);
  });
  return iconStyle;
};
