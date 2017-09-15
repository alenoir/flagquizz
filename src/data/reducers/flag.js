import { Map, List, fromJS } from 'immutable';
import {
  FLAGS_REQUEST,
  FLAGS_SUCCESS,
} from '../actions/flag';

const initialState = Map({
  list: List(),
  count: 0,
});

export default function flag(state = initialState, action) {
  const payload = action.payload;
  switch (action.type) {
    case FLAGS_REQUEST:
      return state.merge({
        loading: true,
      });
    case FLAGS_SUCCESS:
      return state.merge({
        loading: false,
        list: fromJS(payload.flags),
        count: payload.flags.length,
      });
    default:
      return state;
  }
}
