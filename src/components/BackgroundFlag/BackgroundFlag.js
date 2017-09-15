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
    images: PropTypes.any,
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
      currentImage: 0,
    };
  }

  componentDidMount() {
    this.changeImage(this.props.images);
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps', nextProps.images !== this.props.images);
    if (nextProps.images !== this.props.images) {
      this.changeImage(nextProps.images);
    }
  }

  changeImage = (images) => {
    const imageArray = Array.isArray(images) ? images : [images];
    const currentImage = this.state.currentImage;

    if (currentImage === 1) {
      this.setState({
        image2: imageArray[Math.floor(Math.random() * imageArray.length)],
        currentImage: 2,
      });
    } else {
      this.setState({
        image1: imageArray[Math.floor(Math.random() * imageArray.length)],
        currentImage: 1,
      });
    }

    Animated.parallel([
      Animated.timing(
        this.opacity1,
        {
          toValue: currentImage === 1 ? 0 : 1,
          duration: this.props.duration,
          easing: Easing.linear,
          delay: 0,
        },
      ),

      Animated.timing(
        this.opacity2,
        {
          toValue: currentImage !== 1 ? 0 : 1,
          duration: this.props.duration,
          easing: Easing.linear,
          delay: 0,
        },
      ),
    ]).start(() => {
      if (images.length > 1) {
        setTimeout(() => { this.changeImage(images); }, this.props.delay);
      }
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
