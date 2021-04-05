import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyB-RVe8Icisr03G002oOc9Un7GXFjIKe-M',
  authDomain: 'tcl-23-shopping-list.firebaseapp.com',
  projectId: 'tcl-23-shopping-list',
  storageBucket: 'tcl-23-shopping-list.appspot.com',
  messagingSenderId: '17231198664',
  appId: '1:17231198664:web:180626daef3992d3cfe8fd',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
