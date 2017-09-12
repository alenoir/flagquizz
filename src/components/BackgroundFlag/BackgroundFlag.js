import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View,
  Animated,
  Easing,
  Image,
} from 'react-native';

import styles from './styles.js';

export default class BackgroundFlag extends Component {
  static propTypes = {
    images: PropTypes.array,
    duration: PropTypes.number,
    delay: PropTypes.number,
  }

  static defaultProps = {
    images: [],
    duration: 3000,
    delay: 6000,
  };

  constructor() {
    super();

    this.opacity1 = new Animated.Value(0);
    this.opacity2 = new Animated.Value(0);

    this.state = {
      image1: null,
      image2: null,
      currentImage: 1,
    };
  }

  componentDidMount() {
    this.changeImage();
  }

  changeImage = () => {
    const { images } = this.props;

    if (!this.state.image1) {
      this.setState({
        image1: images[Math.floor(Math.random() * images.length)],
        image2: images[Math.floor(Math.random() * images.length)],
        currentImage: 1,
      });
    } else if (this.state.currentImage === 1) {
      this.setState({
        image2: images[Math.floor(Math.random() * images.length)],
        currentImage: 2,
      });
    } else if (this.state.currentImage === 2) {
      this.setState({
        image1: images[Math.floor(Math.random() * images.length)],
        currentImage: 1,
      });
    }
    Animated.parallel([
      Animated.timing(
        this.opacity1,
        {
          toValue: this.state.currentImage === 1 ? 1 : 0,
          duration: this.props.duration,
          easing: Easing.linear,
          delay: 0,
        },
      ),

      Animated.timing(
        this.opacity2,
        {
          toValue: this.state.currentImage === 2 ? 1 : 0,
          duration: this.props.duration,
          easing: Easing.linear,
          delay: 0,
        },
      ),
    ]).start(() => {
      setTimeout(() => { this.changeImage(); }, this.props.delay);
    });
  }

  render = () => (
    <View
      style={styles.container}
    >
      <View
        style={styles.background}
      >
        <Animated.Image
          style={[styles.backgroundImage, {
            opacity: this.opacity1,
          }]}
          resizeMode={'cover'}
          blurRadius={50}
          source={this.state.image1}
        />
      </View>
      <View
        style={styles.background}
      >
        <Animated.Image
          style={[styles.backgroundImage, {
            opacity: this.opacity2,
          }]}
          resizeMode={'cover'}
          blurRadius={50}
          source={this.state.image2}
        />
        <View
          style={styles.overlay}
        />
      </View>
    </View>

  )
}
