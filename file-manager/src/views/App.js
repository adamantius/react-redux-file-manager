import React, { Component } from 'react';
import PropTypes from 'prop-types';
import "font-awesome-webpack2";

import FileManager from './FileManager';

export default class App extends Component {
  
  static propTypes = {
    baseRoots: PropTypes.array
  };
  
  render() {
    return (
        <FileManager baseRoots={ this.props.baseRoots }/>
    );
  }
}
