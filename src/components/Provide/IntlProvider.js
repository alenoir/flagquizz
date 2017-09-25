import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { NativeModules } from 'react-native';

import localeData from '../../assets/translations/locales/data.json';

const locale = (NativeModules.SettingsManager.settings.AppleLocale).split('_')[0];

const messages = localeData[locale] || localeData.en;

console.log(locale);


class ProvideIntl extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    intl: PropTypes.object.isRequired,
  };
  render() {
    return (
      <IntlProvider
        {...this.props.intl}
        defaultLocale={'fr'}
        locale="fr"
        messages={messages}
      >
        {this.props.children}
      </IntlProvider>
    );
  }

}

ProvideIntl.propTypes = {
  ...IntlProvider.propTypes,
  children: PropTypes.element.isRequired,
};

export default connect(state => ({
  intl: state.intl,
}))(ProvideIntl);
