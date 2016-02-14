'use strict';
var ReactDOM = require('react-dom');
var React = require('react');
//var Button = require('react-bootstrap').Button;

module.exports = function() {
  var Hello = React.createClass({
    render: function() {
      return <div onClick={console.log}>Hello {this.props.name}</div>;
    }
  });

  ReactDOM.render(
    (<Hello name="World" />),
    document.getElementById('example')
  );
}
