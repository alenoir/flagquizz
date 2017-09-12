import { fork } from 'redux-saga/effects';
import app from './app';
import flag from './flag';
import question from './question';

export default function* root() {
  yield [
    fork(app),
    fork(flag),
    fork(question),
  ];
}
