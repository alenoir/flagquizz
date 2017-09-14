import { put, takeLatest, fork, call } from 'redux-saga/effects';

import {
  FLAGS_REQUEST,

  flagsSuccess,
} from '../actions/flag';

import {
  fetchFlags,
} from '../services/ApiCalls';

function* handleFlagsRequest() {
  const flags = yield call(fetchFlags);
  console.log('handleFlagsRequest', flags);
  yield put(flagsSuccess({ flags }));
}

function* watchFlagsRequest() {
  yield takeLatest(FLAGS_REQUEST, handleFlagsRequest);
}


export default function* rootSaga() {
  yield [
    fork(watchFlagsRequest),
  ];
}
