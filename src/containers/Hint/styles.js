import { StyleSheet } from 'react-native';
import {
  Fonts,
  Colors,
} from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F00',
  },

  buttonBack: {
    position: 'absolute',
    top: 30,
    left: 10,
    width: 30,
    height: 30,
    zIndex: 100,
  },

  map: {
    flex: 1,
  },
  footer: {
    height: 70,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontFamily: Fonts.Brandon,
    fontWeight: 'bold',
    fontSize: 22,
    color: Colors.white,
    backgroundColor: 'transparent',
    textAlign: 'center',
    lineHeight: 22,
  },
});
