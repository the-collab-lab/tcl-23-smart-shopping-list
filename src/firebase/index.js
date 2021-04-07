import firebase from 'firebase';
import 'firebase/firestore';

// Your web app's Firebase configuration
firebase.initializeApp({
  apiKey: 'AIzaSyB-RVe8Icisr03G002oOc9Un7GXFjIKe-M',
  authDomain: 'tcl-23-shopping-list.firebaseapp.com',
  databaseURL: 'https://tcl-23-shopping-list-default-rtdb.firebaseio.com',
  projectId: 'tcl-23-shopping-list',
  storageBucket: 'tcl-23-shopping-list.appspot.com',
  messagingSenderId: '17231198664',
  appId: '1:17231198664:web:180626daef3992d3cfe8fd',
});

let db = firebase.firestore();

export default {
  firebase,
  db,
};
