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

class Home extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
  };

  render() {
    const { navigation } = this.props;
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
              <View
                style={styles.score}
              >
                <Text
                  style={styles.scoreLeft}
                >
                  23
                </Text>
                <Text
                  style={styles.scoreRight}
                >
                  /220
                </Text>
              </View>
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

const mapStateToProps = () => ({

});

const mapDispatchToProps = () => ({

});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home));
