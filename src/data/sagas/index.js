import { fork } from 'redux-saga/effects';
import app from './app';
import flag from './flag';

export default function* root() {
  yield [
    fork(app),
    fork(flag),
  ];
}
