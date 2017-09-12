import { combineReducers } from 'redux';

import app from './app';
import flag from './flag';
import intl from './intl';

export default combineReducers({
  app,
  flag,
  intl,
});
