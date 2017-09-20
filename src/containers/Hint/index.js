import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Keyboard,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { injectIntl } from 'react-intl';
import MapView from 'react-native-maps';

import QuestionActions from '../../data/actions/question';

import translations from './translations.js';
import styles from './styles.js';
import { Images, Colors } from '../../theme';

class Hint extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    question: PropTypes.object,
  };

  static defaultProps = {
    question: null,
  }

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <View
        style={styles.container}
      >
        <MapView
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  flags: state.flag.get('list'),
  question: state.question,
  flagCount: state.flag.get('count'),
  answeredCount: state.question.get('answeredCount'),
});

const mapDispatchToProps = (dispatch) => ({
  questionActions: bindActionCreators(QuestionActions, dispatch),
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Hint));
