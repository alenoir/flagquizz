import { Map, fromJS } from 'immutable';
import {
  QUESTION_REQUEST,
  QUESTION_SUCCESS,
  QUESTION_ANSWER_REQUEST,
  QUESTION_ANSWER_ERROR,
  QUESTION_ANSWER_SUCCESS,
  QUESTION_HINT_SUCCESS,
  QUESTION_SKIPED,
} from '../actions/question';

const initialState = Map({
  loading: false,
  errored: false,
  succeded: false,
  current: null,
  answered: Map(),
  skiped: Map(),
  answeredCount: 0,
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
        current: payload.question,
      });
    case QUESTION_HINT_SUCCESS:
      return state.merge({
        current: payload.question,
      });
    case QUESTION_ANSWER_SUCCESS:
      const answered = state.get('answered').set(payload.question.get('flag').get('alpha2Code'), payload.question);
      return state.merge({
        answered,
        loading: false,
        errored: false,
        succeded: new Date(),
        answeredCount: answered.size,
      });
    case QUESTION_SKIPED:
      const skiped = (state.get('skiped') || new Map()).set(payload.question.get('flag').get('alpha2Code'), payload.question);
      return state.merge({
        skiped,
      });
    default:
      return state;
  }
}
