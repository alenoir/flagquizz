
import { AsyncStorage } from 'react-native';

const REDUX_PERSIST = {
  active: true,
  reducerVersion: '1',
  storeConfig: {
    storage: AsyncStorage,
    blacklist: [],
    whitelist: [],
    transforms: [],
  },
};

export default REDUX_PERSIST;
