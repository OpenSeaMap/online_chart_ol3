'use strict';
var ReactDOM = require('react-dom');
var React = require('react');
var Button = require('react-bootstrap').Button;

module.exports = function() {

  ReactDOM.render( <Button bsStyle="primary">Right</Button>,
    document.getElementById('example')
  );
}
