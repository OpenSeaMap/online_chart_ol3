'use strict';

var $ = require('jquery');
require('jquerySidebar');

var map = require('map');
var taginfo = require('taginfo');

//var test = require('test');

module.exports = function() {

  var context = {};

    var sidebar = $('#sidebar').sidebar();
    context.sidebar = function() { return sidebar; };

    context.sidebarDetailsContent = function() { return $('#sidebar-details-content'); };
    context.sidebarSettingsContent = function() { return $('#sidebar-settings-content'); };


  var mapObj = map(context);
  context.map = function() { return mapObj; };


  var taginfoObj = taginfo(context);
  context.taginfo = function() { return taginfoObj; };

//  var testObj = test(context);


  return context;
};
