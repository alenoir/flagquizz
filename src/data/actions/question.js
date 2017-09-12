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

export default {
  questionRequest,
  questionSuccess,
};
