import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';
import Main from './src/Main';

export default class FlagQuiz extends Component {
  render() {
    return (
      <Main />
    );
  }
}

AppRegistry.registerComponent('FlagQuiz', () => FlagQuiz);
