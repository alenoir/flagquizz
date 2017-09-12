import { persistStore } from 'redux-persist';
import { startupRequest } from '../actions/app';

const updateReducers = (store: Object, persistConfig) => {
  const reducerVersion = persistConfig.reducerVersion;
  const config = persistConfig.storeConfig;
  const startup = (error, data) => store.dispatch(startupRequest(data));

  // Check to ensure latest reducer version
  persistConfig.storeConfig.storage.getItem('reducerVersion').then((localVersion) => {
    if (localVersion !== reducerVersion) {
      console.tron.display({
        name: 'PURGE',
        value: {
          'Old Version:': localVersion,
          'New Version:': reducerVersion,
        },
        preview: 'Reducer Version Change Detected',
        important: true,
      });

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
