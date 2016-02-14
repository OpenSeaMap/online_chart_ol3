'use strict';

import ReactDOM from 'react-dom'
import React from 'react'

import {IntlProvider} from 'react-intl';

import Sidebar from './Sidebar'

import TagList from './taginfo2'

const taglist=[
  {
    key: 'sport',
    value: 'scuba_diving'
  }
]

const tabs = [
  {
    name: 'main',
    tabSymbol: 'menu-hamburger',
    content: <h1>Hello!</h1>
  },
  {
    name: 'settings',
    tabSymbol: 'cog',
    content: <h1>Hello!</h1>
  },
  {
    name: 'details',
    tabSymbol: 'eye-open',
    content: <TagList tags={taglist} />
  }
]

const locale='en';
const messages={
  'test': 'key: {key} / value: {value}',
  'tags': 'Tags',

  'sidebar-main': 'Online map',
  'sidebar-settings': 'Settings',
  'sidebar-details': 'Details'
}

ReactDOM.render(
  (
  <IntlProvider
      locale={locale}
      messages={messages}
  >
    <div
        className="sidebar-map reset-box-sizing"
        id="map"
    >
      <Sidebar tabs={tabs} />
    </div>
  </IntlProvider>
  ),
  document.getElementById('app')
);
/*
var $ = require('jquery');
var Main = require('main');

$(function() {

  var map = new Main();
  console.log(map);
});*/
