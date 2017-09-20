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

import FlagImages from '../../assets/flags';
import BackgroundFlag from '../../components/BackgroundFlag';
import Badge from '../../components/Badge';
import Score from '../../components/Score';
import QuestionActions from '../../data/actions/question';

import translations from './translations.js';
import styles from './styles.js';
import { Images, Colors } from '../../theme';

const gameSteps = {
  loading: 'GAME_STEP_LOADING',
  playing: 'GAME_STEP_PLAYING',
  errored: 'GAME_STEP_ERRORED',
  win: 'GAME_STEP_WIN',
};

class Game extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    question: PropTypes.object,
    flags: PropTypes.object.isRequired,
    questionActions: PropTypes.object.isRequired,
    answeredCount: PropTypes.number.isRequired,
    flagCount: PropTypes.number.isRequired,
  };

  static defaultProps = {
    question: null,
  }

  constructor(props) {
    super(props);

    const { width } = Dimensions.get('window');

    this.inputPosition = new Animated.Value(0);
    this.imageScale = new Animated.Value(1);
    this.inputOpacity = new Animated.Value(1);
    this.buttonOpacity = new Animated.Value(0);
    this.nameOpacity = new Animated.Value(0);
    this.badgeScale = new Animated.Value(0);
    this.keyboardHeight = new Animated.Value(0);

    const currentQuestion = props.question.get('current');
    let currentFlagImage = null;
    if (currentQuestion) {
      currentFlagImage = FlagImages[currentQuestion.get('flag').get('alpha2Code').toLowerCase()];
    }
    this.state = {
      step: currentQuestion ? gameSteps.playing : gameSteps.loading,
      flag: null,
      answer: '',
      imageWidth: width - 20,
      imageHeight: width * (2 / 3),
      currentFlagImage,
      inputFontSize: 36,
      bottomInputColor: Colors.white,
    };
  }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);

    const { question } = this.props;
    if (!question.get('current')) {
      this.props.questionActions.questionRequest();
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log('++++++++', nextProps.question.get('succeded'), nextProps.question.get('succeded') !== this.props.question.get('succeded'));
    const nextState = {};
    if (nextProps.question.get('loading') !== this.props.question.get('loading') && nextProps.question.get('loading')) {
      nextState.step = gameSteps.loading;
    } else if (nextProps.question.get('errored') !== this.props.question.get('errored') && nextProps.question.get('errored')) {
      nextState.step = gameSteps.errored;
      nextState.bottomInputColor = Colors.red;
      nextState.answer = '';

      setTimeout(() => {
        this.setState({
          step: gameSteps.playing,
          bottomInputColor: Colors.white,
        });
      }, 1000);
    } else if (nextProps.question.get('succeded') !== this.props.question.get('succeded') && nextProps.question.get('succeded')) {
      nextState.step = gameSteps.win;
      nextState.answer = '';
    } else {
      nextState.step = gameSteps.playing;
      if (this.input) {
        this.input.focus();
      }
    }

    const currentQuestion = nextProps.question.get('current');
    if (currentQuestion && currentQuestion.get('flag')) {
      nextState.currentFlagImage = FlagImages[currentQuestion.get('flag').get('alpha2Code').toLowerCase()];
    }

    this.setState(nextState);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.step !== this.state.step) {
      this.changeStep(this.state.step);
    }
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  changeStep = (step) => {
    let nextImageScale = 1;
    let nextInputOpacity = 1;
    let nextButtonOpacity = 0;
    let nextNameOpacity = 0;
    let nextBadgeScale = 0;

    switch (step) {
      case gameSteps.errored:
        nextImageScale = 1;
        nextInputOpacity = 1;
        nextButtonOpacity = 0;
        nextNameOpacity = 0;
        nextBadgeScale = 0;

        Animated.sequence([ // decay, then spring to start and twirl
          Animated.timing(this.inputPosition, {
            toValue: -20,
            duration: 50,
          }),
          Animated.timing(this.inputPosition, {
            toValue: 20,
            duration: 50,
          }),
          Animated.timing(this.inputPosition, {
            toValue: 0,
            duration: 50,
          }),
        ]).start();

        break;
      case gameSteps.win:
        nextImageScale = 0.7;
        nextInputOpacity = 0;
        nextButtonOpacity = 1;
        nextNameOpacity = 1;
        nextBadgeScale = 1;
        break;
      default:
        this.nameOpacity.setValue(0);
        nextImageScale = 1;
        nextInputOpacity = 1;
        nextButtonOpacity = 0;
        nextNameOpacity = 0;
        nextBadgeScale = 0;
        break;
    }

    Animated.parallel([
      Animated.spring(
        this.imageScale,
        {
          toValue: nextImageScale,
          duration: 500,
        },
      ),
      Animated.timing(
        this.inputOpacity,
        {
          toValue: nextInputOpacity,
          duration: 500,
        },
      ),
      Animated.timing(
        this.buttonOpacity,
        {
          toValue: nextButtonOpacity,
          duration: nextButtonOpacity ? 500 : 200,
        },
      ),
      Animated.timing(
        this.nameOpacity,
        {
          toValue: nextNameOpacity,
          duration: 500,
        },
      ),
      Animated.spring(
        this.badgeScale,
        {
          toValue: nextBadgeScale,
          duration: 500,
          delay: nextBadgeScale ? 200 : 0,
        },
      ),
    ]).start();
  }

  keyboardWillShow = (e) => {
    Animated.timing(
      this.keyboardHeight,
      {
        toValue: e.endCoordinates.height,
        duration: e.duration,
        easing: Easing.inOut(Easing.ease),
      },
    ).start();
  }

  keyboardWillHide = (e) => {
    Animated.timing(
      this.keyboardHeight,
      {
        toValue: e.endCoordinates.height,
        duration: e.duration,
        easing: Easing.inOut(Easing.ease),
      },
    ).start();
  }

  handleNextQuestion = () => {
    if (this.state.step === gameSteps.win) {
      this.props.questionActions.questionRequest();
    }
  }

  handleSkip = () => {
    this.props.questionActions.questionRequest();
  }

  handleHint = () => {
    this.props.questionActions.questionHintRequest();
  }

  render() {
    const { question, answeredCount, flagCount } = this.props;
    const { step } = this.state;
    if (step === gameSteps.loading) {
      return <Text>Loading</Text>;
    }

    const currentQuestion = question.get('current');

    return (
      <View
        style={styles.container}
      >
        <BackgroundFlag
          images={this.state.currentFlagImage}
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
            winNumber={answeredCount}
            totalNumber={flagCount}
          />

          <TouchableOpacity
            style={styles.buttonSkip}
            onPress={this.handleSkip}
          >
            <Text
              style={styles.buttonSkipText}
            >
              {this.props.intl.formatMessage(translations.gameButtonSkip)}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={[styles.flag, {

          }]}
        >
          <Animated.Image
            style={[styles.flagImage, {
              transform: [{ scale: this.imageScale }],
              height: this.state.imageHeight,
              width: this.state.imageWidth,
            }]}
            source={this.state.currentFlagImage}
            resizeMode="contain"
          />
          <Animated.View
            style={[styles.wrapperBadge, {
              transform: [{ scale: this.badgeScale }],
            }]}
          >
            <Badge
              label="+1"
            />
          </Animated.View>
          <Animated.View
            style={[styles.wraperCountry, {
              opacity: this.nameOpacity,
            }]}
          >
            <Text
              style={styles.countryname}
            >
              {currentQuestion.get('flag').get('translations').get('fr') /* @TODO: mput translated name */}
            </Text>
          </Animated.View>
        </View>
        <View
          style={[styles.action, {
          }]}
        >

          <Animated.View
            style={[styles.input, {
              opacity: this.inputOpacity,
              transform: [{
                translateX: this.inputPosition,

              },
              {
                translateY: this.inputOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              }],
            }]}
          >
            <TextInput
              style={[styles.inputText, {
                fontSize: this.state.inputFontSize,
              }]}
              onChangeText={(answer) => {
                this.setState({
                  answer: answer.toUpperCase(),
                });
              }}
              underlineColorAndroid={'transparent'}
              value={this.state.answer}
              autoCorrect={false}
              autoComplete={false}
              keyboardType={'default'}
              returnKeyType={'done'}
              autoFocus
              caretHidden
              tintColor={Colors.white}
              selectionColor={Colors.white}
              ref={(ref) => {
                if (ref) {
                  this.input = ref;
                }
              }}
              blurOnSubmit
              autoCapitalize={'characters'}
              onSubmitEditing={() => {
                this.props.questionActions.questionAnswerRequest({ answer: this.state.answer });
                setTimeout(() => {
                  this.input.focus();
                }, 10);
                setTimeout(() => {
                  this.input.focus();
                }, 100);
              }}
            />
            <View
              style={[styles.inputBottom, {
                backgroundColor: this.state.bottomInputColor,
                width: this.state.imageWidth * 0.8,
              }]}
            />
            <TouchableOpacity
              style={styles.buttonHint}
              onPress={() => this.handleHint()}
            >
              <Image
                source={Images.Hint}
              />
            </TouchableOpacity>
          </Animated.View>
          <Animated.View
            style={[styles.buttonWrapper, {
              opacity: this.buttonOpacity,
            }]}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.handleNextQuestion()}
            >
              <Image
                source={Images.Next}
              />
            </TouchableOpacity>
          </Animated.View>
        </View>
        <Animated.View
          style={{
            height: this.keyboardHeight,
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
)(Game));
