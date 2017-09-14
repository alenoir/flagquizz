
import { AsyncStorage } from 'react-native';

const REDUX_PERSIST = {
  active: true,
  reducerVersion: '5',
  storeConfig: {
    storage: AsyncStorage,
    blacklist: [],
    whitelist: ['question', 'flag'],
  },
};

export default REDUX_PERSIST;
