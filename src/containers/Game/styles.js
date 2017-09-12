import { StyleSheet } from 'react-native';
import {
  Fonts,
  Colors,
} from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonBack: {
    marginLeft: 10,
  },
  score: {
    marginRight: 10,
  },

  flag: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  flagImage: {
    flex: 1,
    width: null,
    height: null,
  },

  input: {
    flex: 1,
  },

  fakeKeyboard: {
    flex: 1,
  },
});
