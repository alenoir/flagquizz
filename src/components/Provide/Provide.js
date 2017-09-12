import React, { PropTypes, Component } from 'react';
import { Provider } from 'react-redux';
import IntlProvider from './IntlProvider';

class Provide extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    store: PropTypes.object.isRequired,
  };

  render() {
    return (
      <Provider store={this.props.store}>
        <IntlProvider>
          {this.props.children}
        </IntlProvider>
      </Provider>
    );
  }
}

export default Provide;
