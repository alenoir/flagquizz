import {

} from 'react-native';
import { StackNavigator } from 'react-navigation';
import 'intl';
import 'intl/locale-data/jsonp/fr';
import { addLocaleData } from 'react-intl';
import fr from 'react-intl/locale-data/fr';

import Home from './Home';
import Game from './Game';
import Hint from './Hint';


global.Intl = require('intl');

[fr].forEach(addLocaleData);

const SimpleApp = StackNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      header: null,
    },
  },
  Game: {
    screen: Game,
    navigationOptions: {
      header: null,
    },
  },
  Hint: {
    screen: Hint,
    navigationOptions: {
      header: null,
    },
  },
});

export default SimpleApp;
