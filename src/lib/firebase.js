// NOTE: import only the Firebase modules that you need in your app... except
// for the second line, which makes both the linter and react-firebase happy
import firebase from 'firebase/app';
import 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDSkQvP2IbPPeIcCw9SfsYPWa80HH7Ee7Q',
  authDomain: 'tcl-23-smart-shopping-list.firebaseapp.com',
  projectId: 'tcl-23-smart-shopping-list',
  storageBucket: 'tcl-23-smart-shopping-list.appspot.com',
  messagingSenderId: '52323845240',
  appId: '1:52323845240:web:d46ea8eabee282dbc5998d',
};

// Firebase configuration for the App
const firebaseInstance = firebase.initializeApp(firebaseConfig);

let db = firebaseInstance.firestore();

export { db };
