'use strict';

var $ = require('jquery');
var ko = require('knockout');

ko.components.register('taginfo-block', {
  template: '<ul data-bind="foreach: tags"><li><strong><span data-bind="text: key"></span>:</strong> <span data-bind="text: value"></span></li></ul>',
  viewModel: function(params) {
    this.tags = params.tags;
  }
});

ko.components.register('taginfo-description', {
  template: '<span data-bind="text: description, css: {\'label-warning\': !validData()}" class="label label-default"></span>',
  viewModel: function(params) {
    this.details = params.details;
    this.validData = ko.observable(false);
    this.description = ko.observable('');
    try {
      var data = this.details().data[0];
      this.description(data.description);
      this.validData(true);
    } catch (err) {
      this.description('Not found.');
    }
  }
});

ko.components.register('taginfo-waiting', {
  template: '<div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div></div>'
});

ko.components.register('taginfo-tag', {
  template: '<div class="list-group-item-heading input-group"><span class="input-group-addon" data-bind="text: key"></span> <input class="form-control" data-bind="value: value" readonly></input> <span class="input-group-btn"><button class="btn btn-default" type="button" aria-label="more information" data-bind="click: toggleDetails, css: { active: detailsVisible}">?</button></span></div><div class="list-group-item-text" data-bind="if: detailsVisible"><div data-bind="component: { name: detailsComponentName, params: {details: details}}"></div></div>',
  viewModel: function(params) {
    this.key = params.key;
    this.value = params.value;

    this.detailsVisible = ko.observable(false);
    this.detailsLoaded = ko.observable(false);
    this.detailsComponentName = ko.pureComputed(function() {
      if (!this.detailsLoaded()) {
        return 'taginfo-waiting';
      }
      return 'taginfo-description';
    }, this);

    this.details = ko.observable();
    this.toggleDetails = function() {
      this.detailsVisible(!this.detailsVisible());
      if (!this.detailsVisible()) {
        return;
      }
      if (this.detailsLoaded()) {
        return;
      }

      $.getJSON('https://taginfo.openstreetmap.org/api/4/' + 'tag/wiki_pages?' + 'key=' + this.key + '&value=' + this.value, function(data) {
        this.details(data);
        this.detailsLoaded(true);
      }.bind(this));
    }.bind(this);
  }
});


module.exports = function(context) {
  var self = {};

  var viewModel = {
    activeFeatureTags: ko.observableArray()
  };
  context.sidebarDetailsContent().html('<div data-bind="if: activeFeatureTags().length==0"><div class="bs-callout-primary">Hover or click on objects to see details about them here.</div></div><div data-bind="if: activeFeatureTags().length>0"><div class="panel panel-default"><div class="panel-heading">Tags</div><ul class="list-group" data-bind="foreach: activeFeatureTags"><li class="list-group-item" data-bind="component: {name: \'taginfo-tag\', params: {key: key, value: value}}"></li></ul></div>');
  ko.applyBindings(viewModel, context.sidebarDetailsContent().get(0));

  var ignoredTags = ['geometry'];

  self.render = function(feature) {
    viewModel.activeFeatureTags.removeAll();
    feature.getKeys().forEach(function(key) {
      if ($.inArray(key, ignoredTags) > -1){
        return;
      }

      viewModel.activeFeatureTags.push({
        key: key,
        value: feature.get(key)
      });
    });

  };

  return self;
};
