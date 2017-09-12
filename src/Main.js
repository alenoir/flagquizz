
import React, { Component } from 'react';
import 'intl';
import 'intl/locale-data/jsonp/fr';
import { addLocaleData } from 'react-intl';
import fr from 'react-intl/locale-data/fr';

import App from './containers/App';
import configureStore from './data/store/configureStore';
import ReduxPersist from './config/ReduxPersist';
import Provide from './components/Provide';

global.Intl = require('intl');

[fr].forEach(addLocaleData);

const store = configureStore(ReduxPersist);

class Main extends Component {

  render() {
    return (
      <Provide store={store}>
        <App />
      </Provide>
    );
  }
}

export default Main;
