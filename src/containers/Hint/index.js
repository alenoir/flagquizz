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
  };

  static defaultProps = {
    question: null,
  }

  constructor(props) {
    super(props);

    const delta = 60;

    const flag = this.props.navigation.state.params.flag;


    const minusLat = Math.random() >= 0.5;
    const minusLng = Math.random() >= 0.5;
    const randLatDelta = Math.floor(Math.random() * (delta - 30)) * (minusLat ? -1 : 1);
    const randLngDelta = Math.floor(Math.random() * (delta - 30)) * (minusLng ? -1 : 1);

    console.log(flag.toJS(), randLatDelta, randLngDelta, minusLat, minusLng);
    this.state = {
      lat: (flag.get('latlng').get('0') + randLatDelta),
      lng: (flag.get('latlng').get('1') + randLngDelta),
      delta,
    };
  }

  render() {
    console.log('++++', this.state);
    const { lat, lng, delta } = this.state;

    return (
      <View
        style={styles.container}
      >
        <TouchableOpacity
          style={styles.buttonBack}
          onPress={() => this.props.navigation.goBack()}
        >
          <Image
            source={Images.Back}
          />
        </TouchableOpacity>
        <MapView
          style={styles.map}
          mapType={'satellite'}
          showsMyLocationButton={false}
          showsCompass={false}
          showsScale={false}
          showsBuildings={false}
          showsTraffic={false}
          showsIndoors={false}
          initialRegion={{
            latitude: lat,
            longitude: lng,
            latitudeDelta: delta,
            longitudeDelta: delta,
          }}
        />
        <View
          style={styles.footer}
        >
          <Text
            style={styles.footerText}
          >
            {this.props.intl.formatMessage(translations.hintTitle)}
          </Text>
        </View>
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
