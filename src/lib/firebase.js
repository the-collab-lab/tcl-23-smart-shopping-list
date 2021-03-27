// NOTE: import only the Firebase modules that you need in your app... except
// for the second line, which makes both the linter and react-firebase happy
import firebase from 'firebase/app';
import 'firebase/firestore';

// Initalize Firebase.
// These details will need to be replaced with the project specific env vars at the start of each new cohort.
var firebaseConfig = {
    apiKey: "AIzaSyB-RVe8Icisr03G002oOc9Un7GXFjIKe-M",
    authDomain: "tcl-23-shopping-list.firebaseapp.com",
    projectId: "tcl-23-shopping-list",
    storageBucket: "tcl-23-shopping-list.appspot.com",
    messagingSenderId: "17231198664",
    appId: "1:17231198664:web:180626daef3992d3cfe8fd"
};

let fb = firebase.initializeApp(firebaseConfig);

export { fb };
