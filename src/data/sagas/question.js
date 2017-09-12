import { put, takeLatest, fork, select } from 'redux-saga/effects';

import {
  QUESTION_REQUEST,

  questionSuccess,
} from '../actions/question';

function* handleQuestionRequest() {
  const state = yield select();
  const flagState = state.flag;
  const questionState = state.question;

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
  };
  yield put(questionSuccess({ question }));
}

function* watchQuestionRequest() {
  yield takeLatest(QUESTION_REQUEST, handleQuestionRequest);
}


export default function* rootSaga() {
  yield [
    fork(watchQuestionRequest),
  ];
}
