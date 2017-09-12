import {

} from 'react-native';
import { DrawerNavigator } from 'react-navigation';
import 'intl';
import 'intl/locale-data/jsonp/fr';
import { addLocaleData } from 'react-intl';
import fr from 'react-intl/locale-data/fr';

import Home from './Home';
import Game from './Game';


global.Intl = require('intl');

[fr].forEach(addLocaleData);

const SimpleApp = DrawerNavigator({
  Home: { screen: Home },
  Game: { screen: Game },
});

export default SimpleApp;
