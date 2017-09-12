import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { injectIntl } from 'react-intl';

import FlagImages from '../../assets/flags';
import BackgroundFlag from '../../components/BackgroundFlag';
import Score from '../../components/Score';
import QuestionActions from '../../data/actions/question';

import translations from './translations.js';
import styles from './styles.js';
import { Images } from '../../theme';

class Game extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    question: PropTypes.object.isRequired,
    flags: PropTypes.object.isRequired,
    questionActions: PropTypes.object.isRequired,
  };

  constructor() {
    super();

    this.state = {
      flag: null,
    };
  }

  componentDidMount() {
    const { question } = this.props;

    if (!question) {
      this.props.questionActions.questionRequest();
    }
  }


  render() {
    const { question } = this.props;
    console.log('question', question);
    if (!question) {
      return <Text>Loading</Text>;
    }

    const currentFlagImage = FlagImages[question.get('flag').get('alpha2Code').toLowerCase()];

    return (
      <View
        style={styles.container}
      >
        <BackgroundFlag
          images={[currentFlagImage]}
        />
        <View
          style={styles.header}
        >
          <TouchableOpacity
            style={styles.buttonBack}
            onPress={() => this.props.navigation.goBack()}
          >
            <Image
              source={Images.Back}
            />
          </TouchableOpacity>

          <Score
            style={styles.score}
            winNumber={22}
            totalNumber={250}
          />
        </View>
        <View
          style={styles.flag}
        >
          <Image
            style={styles.flagImage}
            source={currentFlagImage}
            resizeMode={'cover'}
          />
        </View>
        <View
          style={styles.input}
        >
          <TouchableOpacity
            style={styles.buttonPlay}
            onPress={() => this.props.navigation.goBack()}
          >
            <Image
              source={Images.Back}
            />
          </TouchableOpacity>
        </View>
        <View
          style={styles.fakeKeyboard}
        />

      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  flags: state.flag.get('list'),
  question: state.question.get('current'),
});

const mapDispatchToProps = (dispatch) => ({
  questionActions: bindActionCreators(QuestionActions, dispatch),
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Game));
