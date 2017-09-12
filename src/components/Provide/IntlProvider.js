import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';

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
