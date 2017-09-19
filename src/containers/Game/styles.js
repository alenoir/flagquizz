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

  buttonWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
