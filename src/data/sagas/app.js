import { put, takeLatest, fork } from 'redux-saga/effects';

import {
  STARTUP_REQUEST,

  startupSuccess,
} from '../actions/app';

import {
  flagsRequest,
} from '../actions/flag';

function* handleStartup(action) {
  yield put(flagsRequest());
  yield put(startupSuccess({ payload: action.payload }));
}

function* StartupWatchWatch() {
  yield takeLatest(STARTUP_REQUEST, handleStartup);
}


export default function* rootSaga() {
  yield [
    fork(StartupWatchWatch),
  ];
}
