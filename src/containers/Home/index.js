import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import FlagImages from '../../assets/flags';
import translations from './translations.js';
import styles from './styles.js';
import { Images } from '../../theme';
import BackgroundFlag from '../../components/BackgroundFlag';
import Score from '../../components/Score';

class Home extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    answeredCount: PropTypes.number.isRequired,
    flagCount: PropTypes.number.isRequired,
  };

  render() {
    const { navigation, answeredCount, flagCount } = this.props;
    const { navigate } = navigation;

    return (
      <View
        style={styles.container}
      >
        <BackgroundFlag
          images={Object.values(FlagImages)}
        />
        <View
          style={styles.top}
        />
        <View
          style={styles.content}
        >
          <View
            style={styles.colLeft}
          />
          <View
            style={styles.colSeparator}
          />
          <View
            style={styles.colRight}
          >
            <View
              style={styles.titleWrapper}
            >
              <Text
                style={styles.title}
              >
                {this.props.intl.formatMessage(translations.homeTitle).toUpperCase()}
              </Text>
              <Text
                style={styles.subtitle}
              >
                {this.props.intl.formatMessage(translations.homeSubtitle).toUpperCase()}
              </Text>
              <Score
                winNumber={answeredCount}
                totalNumber={flagCount}
              />
            </View>

            <View
              style={styles.footerWrapper}
            >
              <TouchableOpacity
                style={styles.buttonPlay}
                onPress={() => navigate('Game', { user: 'Lucy' })}
              >
                <Text
                  style={styles.buttonPlayText}
                >
                  {this.props.intl.formatMessage(translations.homeButton)}
                </Text>
                <Image
                  source={Images.Play}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>


      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  flagCount: state.flag.get('count'),
  answeredCount: state.question.get('answeredCount'),
});

const mapDispatchToProps = () => ({

});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home));
