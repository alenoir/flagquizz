import { Map, List, fromJS } from 'immutable';
import {
  QUESTION_REQUEST,
  QUESTION_SUCCESS,
} from '../actions/question';

const initialState = Map({
  current: null,
  answered: List(),
});

export default function question(state = initialState, action) {
  const payload = action.payload;
  switch (action.type) {
    case QUESTION_REQUEST:
      return state.merge({
        loading: true,
      });
    case QUESTION_SUCCESS:
      return state.merge({
        loading: false,
        current: fromJS(payload.question),
      });
    default:
      return state;
  }
}
