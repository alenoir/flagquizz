import { Platform } from 'react-native';
import { createStore, applyMiddleware, compose } from 'redux';
import { autoRehydrate } from 'redux-persist';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import R from 'ramda';
import devTools from 'remote-redux-devtools';

import RehydrationServices from '../services/RehydrationServices';
import rootReducer from '../reducers';
import rootSaga from '../sagas';

export default (persistConfig, customMiddleware) => {
  const middleware = customMiddleware || [];
  const enhancers = [];

  const sagaMiddleware = createSagaMiddleware();
  middleware.push(sagaMiddleware);

  const SAGA_LOGGING_BLACKLIST = ['EFFECT_TRIGGERED', 'EFFECT_RESOLVED', 'EFFECT_REJECTED', 'persist/REHYDRATE'];
  if (__DEV__) {
    const USE_LOGGING = __DEV__;
    const logger = createLogger({
      predicate: (getState, { type }) =>
      USE_LOGGING && R.not(R.contains(type, SAGA_LOGGING_BLACKLIST)),
    });
    middleware.push(logger);
  }

  enhancers.push(applyMiddleware(...middleware));

  if (persistConfig.active) {
    enhancers.push(autoRehydrate());
  }

  enhancers.push(devTools({
    name: Platform.OS,
  }));

  const store = createStore(rootReducer, compose(...enhancers));

  if (persistConfig.active) {
    RehydrationServices.updateReducers(store, persistConfig);
  }

  sagaMiddleware.run(rootSaga);

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('../reducers/index').default; // eslint-disable-line
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};
