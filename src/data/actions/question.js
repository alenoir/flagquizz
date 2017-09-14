export const QUESTION_REQUEST = 'QUESTION_REQUEST';
export function questionRequest(data) {
  return {
    type: QUESTION_REQUEST,
    payload: data,
  };
}

export const QUESTION_SUCCESS = 'QUESTION_SUCCESS';
export function questionSuccess(data) {
  return {
    type: QUESTION_SUCCESS,
    payload: data,
  };
}

export const QUESTION_ANSWER_REQUEST = 'QUESTION_ANSWER_REQUEST';
export function questionAnswerRequest(data) {
  return {
    type: QUESTION_ANSWER_REQUEST,
    payload: data,
  };
}

export const QUESTION_ANSWER_SUCCESS = 'QUESTION_ANSWER_SUCCESS';
export function questionAnswerSuccess(data) {
  return {
    type: QUESTION_ANSWER_SUCCESS,
    payload: data,
  };
}

export const QUESTION_ANSWER_ERROR = 'QUESTION_ANSWER_ERROR';
export function questionAnswerError(data) {
  return {
    type: QUESTION_ANSWER_ERROR,
    payload: data,
  };
}

export default {
  questionRequest,
  questionSuccess,
  questionAnswerRequest,
  questionAnswerSuccess,
  questionAnswerError,
};
