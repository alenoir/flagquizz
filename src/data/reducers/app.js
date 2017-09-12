import { Map, fromJS } from 'immutable';

import {
  STARTUP_SUCCESS,
} from '../actions/app';

const initialState = Map({
  loaded: false,
});

export default function app(state = initialState, action) {
  switch (action.type) {
    case STARTUP_SUCCESS:
      return state.merge({
        loaded: true,
      });
    default:
      return state;
  }
}
