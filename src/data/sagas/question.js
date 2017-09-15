import { put, takeLatest, fork, select } from 'redux-saga/effects';
import { List, fromJS } from 'immutable';
import Fuse from 'fuse.js';

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
  console.log('flagState', flagState);

  const filteredFlags = flagState.get('list').filter((flag) => {
    const alreadyAnswered = questionState.get('answered').filter((question) => (question.get('flag').get('alpha2Code') === flag.get('alpha2Code'))).size;
    console.log('alreadyAnswered', alreadyAnswered);

    return !alreadyAnswered;
  });

  console.log('filteredFlags', filteredFlags);
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

  const answerObject = {
    answer: action.payload.answer,
  };
  const options = {
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 10,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    includeScore: true,
    includeMatches: true,
    keys: ['translations', 'name', 'nativeName', 'demonym'],
  };
  const fuzzySearch = new Fuse([currentQuestion.get('flag').toJS()], options);
  const fuzzyResult = fuzzySearch.search(action.payload.answer);

  console.log('fuzzyResult', fuzzyResult, fuzzySearch);

  answerObject.fuzzyResult = fuzzyResult;

  console.log('answerObject', answerObject);
  currentQuestion = currentQuestion.set('answers', currentQuestion.get('answers') || List());
  currentQuestion = currentQuestion.set('answers', currentQuestion.get('answers').push(fromJS(answerObject)));
  currentQuestion = currentQuestion.set('answerTime', new Date());

  if (fuzzyResult[0] && fuzzyResult[0].matches.length > 0) {
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
