import { put, takeLatest, fork, select } from 'redux-saga/effects';
import { List, fromJS } from 'immutable';
import Levenshtein from 'levenshtein';

import {
  QUESTION_REQUEST,
  QUESTION_ANSWER_REQUEST,

  questionSuccess,
  questionAnswerError,
  questionAnswerSuccess,
} from '../actions/question';

function* handleQuestionRequest() {
  const state = yield select();
  const flagState = state.flag;
  const questionState = state.question;

  const filteredFlags = flagState.get('list').filter((flag) => {
    const alreadyAnswered = questionState.get('answered').filter((question) => (question.get('flag').get('alpha2Code') === flag.get('alpha2Code'))).size;
    return !alreadyAnswered;
  });

  const nextFlag = filteredFlags.get(Math.floor(Math.random() * filteredFlags.size));

  const question = {
    startTime: new Date(),
    flag: nextFlag,
    answers: [],
  };
  yield put(questionSuccess({ question }));
}

function* handleQuestionAnswerRequest(action) {
  const state = yield select();
  const questionState = state.question;
  let valid = false;
  let currentQuestion = questionState.get('current');

  const currentFlag = currentQuestion.get('flag').toJS();
  const answer = action.payload.answer.toLowerCase();
  const answerObject = {
    answer,
  };

  let score = 1000;

  answerObject.levenResult = {
    name: (new Levenshtein(currentFlag.name.toLowerCase(), answer)).distance,
    nativeName: (new Levenshtein(currentFlag.nativeName.toLowerCase(), answer)).distance,
    demonym: (new Levenshtein(currentFlag.nativeName.toLowerCase(), answer)).distance,
  };

  Object.keys(currentFlag.translations).forEach((key) => {
    const translation = currentFlag.translations[key].toLowerCase();
    answerObject.levenResult[key] = (new Levenshtein(translation, answer)).distance;
  });

  score = Object.values(answerObject.levenResult).reduce((result, item) =>
    (result > item ? item : result), score);

  currentQuestion = currentQuestion.set('answers', currentQuestion.get('answers') || List());
  currentQuestion = currentQuestion.set('answers', currentQuestion.get('answers').push(fromJS(answerObject)));
  currentQuestion = currentQuestion.set('answerTime', new Date());

  if (score < 3) {
    valid = true;
  }
  if (valid) {
    yield put(questionAnswerSuccess({ question: currentQuestion }));
  } else {
    yield put(questionAnswerError({ question: currentQuestion }));
  }
}

function* watchQuestionRequest() {
  yield takeLatest(QUESTION_REQUEST, handleQuestionRequest);
}

function* watchQuestionAnswerRequest() {
  yield takeLatest(QUESTION_ANSWER_REQUEST, handleQuestionAnswerRequest);
}


export default function* rootSaga() {
  yield [
    fork(watchQuestionRequest),
    fork(watchQuestionAnswerRequest),
  ];
}
