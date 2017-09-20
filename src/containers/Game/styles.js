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
    marginTop: 20,
    height: 40,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  buttonBack: {
    flex: 1,
    marginLeft: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  score: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSkip: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  buttonSkipText: {
    fontFamily: Fonts.Brandon,
    fontWeight: 'bold',
    fontSize: 22,
    color: Colors.white,
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginRight: 10,
  },

  flag: {
    flex: 2,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 0,
    marginBottom: 0,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagImage: {

  },
  wrapperBadge: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },

  wraperCountry: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  countryname: {
    fontFamily: Fonts.Brandon,
    fontWeight: 'bold',
    fontSize: 22,
    color: Colors.white,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },

  action: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    zIndex: 100,
  },
  inputText: {
    fontFamily: Fonts.Brandon,
    fontWeight: 'bold',
    fontSize: 36,
    color: Colors.white,
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginRight: 20,
    marginLeft: 20,
  },
  inputBottom: {
    borderRadius: 2.5,
    backgroundColor: Colors.white,
    height: 5,
    marginRight: 60,
    marginLeft: 60,
    opacity: 0.3,
  },
  buttonHint: {
    position: 'absolute',
    right: 10,
    width: 40,
    height: 40,
    marginRight: 10,
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 102,
  },

  buttonWrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 101,
  },
});
