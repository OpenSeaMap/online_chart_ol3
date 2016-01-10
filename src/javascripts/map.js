'use strict';

var ol = require('openlayers');
var $ = require('jquery');
var ko = require('knockout');

require('bootstrap-toggle');
require('knockout-bootstrap-toggle');

require('bootstrap/tooltip.js');

var OpenStreetMapBase = require('./layers/openStreetMapBase');
var DepthMv = require('./layers/germany_mv_depth');
var Scuba = require('./layers/scubaDiving');
var Seamarks = require('./layers/seamarks');
var SeamarksDebug = require('./layers/seamarkDebug');

ol.control.Sidebar = function(optOptions) {
  var options = optOptions || {};
  var element = $('#sidebar').get(0);

  ol.control.Control.call(this, {
    element: element,
    target: options.target
  });
};
ol.inherits(ol.control.Sidebar, ol.control.Control);

module.exports = function(context) {
  var self = {};

  var lon = 11.48;
  var lat = 53.615;
  var zoom = 14;

  var attribution = new ol.control.Attribution({
    collapsible: false
  });

  var defaultControls = ol.control.defaults({
    attribution: false
  });

  var addedControls = new ol.Collection([
    new ol.control.Sidebar(),
    attribution,
    new ol.control.FullScreen(),
    new ol.control.Zoom(),
    new ol.control.ScaleLine({
      units: 'nautical',
      className: 'ol-scale-line-nautical ol-scale-line'
    }),
    new ol.control.ScaleLine({
      units: 'metric',
      className: 'ol-scale-line-metric ol-scale-line'
    })
  ]);

  var controls = addedControls.extend(defaultControls);

  var map = new ol.Map({
    target: 'map',
    view: new ol.View({
      center: ol.proj.fromLonLat([lon, lat]),
      zoom: zoom
    }),
    controls: controls
  });

  function checkSize() {
    var small = map.getSize()[0] < 600;
    attribution.setCollapsible(small);
    attribution.setCollapsed(small);
  }

  window.addEventListener('resize', checkSize);
  checkSize();


  $('.ol-zoom-in, .ol-zoom-out').tooltip({
    placement: 'right'
  });
  $('.ol-rotate-reset, .ol-attribution button[title]').tooltip({
    placement: 'left'
  });

  var target = map.getTarget();

  //target returned might be the DOM element or the ID of this element dependeing on how the map was initialized
  //either way get a jQuery selfect for it
  var jTarget = typeof target === 'string' ? $('#' + target) : $(target);
  self.mapTargetJ = function() {
    return jTarget;
  };

  self.viewModel = {
    chartLayers: ko.observableArray()
  };

  self.viewModel.chartLayers.subscribe(function(changes) {
    changes.forEach(function(change) {
      if (change.status === 'added') {
        console.log('Added:', ko.utils.unwrapObservable(change.value));
        console.assert(change.value.layer);
        map.addLayer(change.value.layer);
        change.value.interactions.forEach(function(interaction) {
          map.addInteraction(interaction);
        });
      }
      if (change.status === 'deleted') {
        console.log('Added:', change.value);
        console.assert(change.value.layer);
        map.removeLayer(change.value.layer);
        change.value.interactions.forEach(function(interaction) {
          map.removeInteraction(interaction);
        });
      }
    });

  }, null, 'arrayChange');

  self.viewModel.chartLayers.push(new OpenStreetMapBase(context, {
    visible: true
  }));

  self.viewModel.chartLayers.push(new DepthMv(context, {
    visible: true
  }));
  self.viewModel.chartLayers.push(new Seamarks(context));
  self.viewModel.chartLayers.push(new SeamarksDebug(context, {
    visible: false
  }));
  self.viewModel.chartLayers.push(new Scuba(context, {
    visible: true
  }));

  ko.applyBindings(self.viewModel, context.sidebarSettingsContent().get(0));


  return self;
};
