import { persistStore, createTransform } from 'redux-persist';
import { startupRequest } from '../actions/app';
import immutableTransform from 'redux-persist-transform-immutable';

const updateReducers = (store: Object, persistConfig) => {
  const reducerVersion = persistConfig.reducerVersion;
  const config = persistConfig.storeConfig;
  const startup = (error, data) => store.dispatch(startupRequest(data));

  config.transforms = [immutableTransform()];
  // Check to ensure latest reducer version
  persistConfig.storeConfig.storage.getItem('reducerVersion').then((localVersion) => {
    if (localVersion !== reducerVersion) {
      // Purge store
      persistStore(store, config, startup).purge();
      persistConfig.storeConfig.storage.setItem('reducerVersion', reducerVersion);
    } else {
      persistStore(store, config, startup);
    }
  }).catch(() => {
    persistStore(store, config, startup);
    persistConfig.storeConfig.storage.setItem('reducerVersion', reducerVersion);
  });
};

export default { updateReducers };
