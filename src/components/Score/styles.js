import { StyleSheet } from 'react-native';

import {
  Fonts,
  Colors,
} from '../../theme';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: -10,
  },
  scoreLeft: {
    fontFamily: Fonts.Brandon,
    fontWeight: 'bold',
    fontSize: 22,
    color: Colors.white,
    backgroundColor: 'transparent',
  },
  scoreRight: {
    fontFamily: Fonts.Brandon,
    fontWeight: '100',
    fontSize: 22,
    color: Colors.white,
    backgroundColor: 'transparent',
  },
});
