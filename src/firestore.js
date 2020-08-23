import credentials from '../firebase-info.json';
import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseApp = firebase.initializeApp(credentials);
export default firebaseApp.firestore();