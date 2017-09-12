import { combineReducers } from 'redux';

import app from './app';
import flag from './flag';
import intl from './intl';
import question from './question';

export default combineReducers({
  app,
  flag,
  intl,
  question,
});
