import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseApp = firebase.initializeApp({
  "apiKey": "AIzaSyDO-bUWgR9rU0E1kBEyQEPrPcaZSWZ7rQM",
  "authDomain": "armor-tracker.firebaseapp.com",
  "databaseURL": "https://armor-tracker.firebaseio.com",
  "projectId": "armor-tracker",
  "storageBucket": "armor-tracker.appspot.com",
  "messagingSenderId": "101214793739",
  "appId": "1:101214793739:web:18b4577ec75947d8f8970e"
});

export default firebaseApp.firestore();