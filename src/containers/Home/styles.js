import { StyleSheet } from 'react-native';
import {
  Fonts,
  Colors,
} from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
  },

  top: {
    flex: 1,

  },
  content: {
    flex: 3,
    flexDirection: 'row',

  },

  colLeft: {
    flex: 1,
  },
  colSeparator: {
    borderRadius: 2.5,
    backgroundColor: Colors.white,
    width: 5,
  },
  colRight: {
    flex: 4,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  titleWrapper: {
    paddingTop: 5,
    paddingLeft: 5,
  },

  title: {
    fontFamily: Fonts.Brandon,
    fontWeight: 'bold',
    fontSize: 64,
    color: Colors.white,
    marginTop: -15,
  },
  subtitle: {
    fontFamily: Fonts.Brandon,
    fontWeight: 'bold',
    fontSize: 36,
    color: Colors.white,
    marginTop: -25,
  },

  score: {
    flexDirection: 'row',
    marginTop: -10,
  },
  scoreLeft: {
    fontFamily: Fonts.Brandon,
    fontWeight: 'bold',
    fontSize: 22,
    color: Colors.white,
  },
  scoreRight: {
    fontFamily: Fonts.Brandon,
    fontWeight: '100',
    fontSize: 22,
    color: Colors.white,
  },

  footerWrapper: {
    alignSelf: 'flex-end',
    marginBottom: 50,
    marginRight: 50,

  },
  buttonPlay: {
    flexDirection: 'row',
  },
  buttonPlayText: {
    fontFamily: Fonts.Brandon,
    fontWeight: 'bold',
    fontSize: 22,
    color: Colors.white,
    marginRight: 9,
  },
});
