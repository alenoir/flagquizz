import { put, takeLatest, fork, select } from 'redux-saga/effects';
import { List, fromJS } from 'immutable';
import Levenshtein from 'levenshtein';

import firebase from '../services/firebase';

import {
  QUESTION_REQUEST,
  QUESTION_ANSWER_REQUEST,
  QUESTION_HINT_REQUEST,

  questionSuccess,
  questionAnswerError,
  questionAnswerSuccess,
  questionHintSuccess,
  questionSkiped,
} from '../actions/question';

function* handleQuestionRequest() {
  const state = yield select();
  const flagState = state.flag;
  const questionState = state.question;

  const filteredFlags = flagState.get('list').filter((flag) => {
    const alreadyAnswered = questionState.get('answered').filter((question) => (question.get('flag').get('alpha2Code') === flag.get('alpha2Code'))).size;
    return !alreadyAnswered;
  });

  let currentQuestion = questionState.get('current');

  if (currentQuestion) {
    const skipObject = {
      time: new Date(),
    };
    currentQuestion = currentQuestion.set('skips', currentQuestion.get('skips') || List());
    currentQuestion = currentQuestion.set('skips', currentQuestion.get('skips').push(fromJS(skipObject)));
    yield put(questionSkiped({ question: currentQuestion }));

    firebase.analytics().logEvent('skip', {
      flagCode: currentQuestion.get('flag').get('alpha2Code'),
      flagName: currentQuestion.get('flag').get('name'),
    });
  }

  const nextFlag = filteredFlags.get(Math.floor(Math.random() * filteredFlags.size));
  const skipedQuestions = questionState.get('skiped') || Map();
  const question = skipedQuestions.get(nextFlag.get('alpha2Code')) || {
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
    demonym: (new Levenshtein(currentFlag.demonym.toLowerCase(), answer)).distance,
  };

  Object.keys(currentFlag.translations).forEach((key) => {
    if (currentFlag.translations[key]) {
      const translation = currentFlag.translations[key].toLowerCase();
      answerObject.levenResult[key] = (new Levenshtein(translation, answer)).distance;
    }
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

  firebase.analytics().logEvent('answer', {
    flagCode: currentQuestion.get('flag').get('alpha2Code'),
    flagName: currentQuestion.get('flag').get('name'),
    answer,
    valid,
  });
}


function* handleQuestionHintRequest() {
  const state = yield select();
  const questionState = state.question;
  let currentQuestion = questionState.get('current');

  const hintObject = {
    hintType: 'map',
    time: new Date(),
  };

  currentQuestion = currentQuestion.set('hints', currentQuestion.get('hints') || List());
  currentQuestion = currentQuestion.set('hints', currentQuestion.get('hints').push(fromJS(hintObject)));

  yield put(questionHintSuccess({ question: currentQuestion }));

  firebase.analytics().logEvent('hint', {
    flagCode: currentQuestion.get('flag').get('alpha2Code'),
    flagName: currentQuestion.get('flag').get('name'),
    hintType: 'map',
  });
}

function* watchQuestionRequest() {
  yield takeLatest(QUESTION_REQUEST, handleQuestionRequest);
}

function* watchQuestionAnswerRequest() {
  yield takeLatest(QUESTION_ANSWER_REQUEST, handleQuestionAnswerRequest);
}

function* watchQuestionHintRequest() {
  yield takeLatest(QUESTION_HINT_REQUEST, handleQuestionHintRequest);
}


export default function* rootSaga() {
  yield [
    fork(watchQuestionRequest),
    fork(watchQuestionHintRequest),
    fork(watchQuestionAnswerRequest),
  ];
}
