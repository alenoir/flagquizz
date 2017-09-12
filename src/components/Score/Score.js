import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';

import styles from './styles.js';

export default class Score extends Component {
  static propTypes = {
    winNumber: PropTypes.number.isRequired,
    totalNumber: PropTypes.number.isRequired,
    style: PropTypes.any,
  }

  static defaultProps = {
    style: null,
  }

  render = () => (
    <View
      style={[styles.container, this.props.style]}
    >
      <Text
        style={styles.scoreLeft}
      >
        {this.props.winNumber}
      </Text>
      <Text
        style={styles.scoreRight}
      >
        /{this.props.totalNumber}
      </Text>
    </View>

  )
}
