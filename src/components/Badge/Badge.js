import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';

import styles from './styles.js';

export default class BackgroundFlag extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    size: PropTypes.number,
  }

  static defaultProps = {
    size: 50,
  }

  render = () => (
    <View
      style={[styles.container, {
        width: this.props.size,
        height: this.props.size,
        borderRadius: this.props.size / 2,
      }]}
    >
      <Text
        style={[styles.text, {

        }]}
      >
        {this.props.label}
      </Text>
    </View>

  )
}
