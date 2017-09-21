import RNFirebase from 'react-native-firebase';

const configurationOptions = {
  debug: true,
};

const firebase = RNFirebase.initializeApp(configurationOptions);

// firebase.admob().initialize('ca-app-pub-3940256099942544~3347511713');
firebase.admob().initialize('ca-app-pub-3076785724903283~8612962477');
// firebase.admob().openDebugMenu();

export default firebase;
