import { Map, List, fromJS } from 'immutable';
import {
  QUESTION_REQUEST,
  QUESTION_SUCCESS,
  QUESTION_ANSWER_REQUEST,
  QUESTION_ANSWER_ERROR,
  QUESTION_ANSWER_SUCCESS,
} from '../actions/question';

const initialState = Map({
  loading: false,
  errored: false,
  succeded: false,
  current: null,
  answered: List(),
});

export default function question(state = initialState, action) {
  const payload = action.payload;
  switch (action.type) {
    case QUESTION_REQUEST:
      return state.merge({
        loading: true,
        errored: false,
        succeded: false,
      });
    case QUESTION_SUCCESS:
      return state.merge({
        loading: false,
        errored: false,
        succeded: false,
        current: fromJS(payload.question),
      });
    case QUESTION_ANSWER_REQUEST:
      return state.merge({
        loading: false,
        errored: false,
        succeded: false,
      });
    case QUESTION_ANSWER_ERROR:
      return state.merge({
        loading: false,
        errored: new Date(),
        succeded: false,
      });
    case QUESTION_ANSWER_SUCCESS:
      return state.merge({
        loading: false,
        errored: false,
        succeded: true,
      });
    default:
      return state;
  }
}
