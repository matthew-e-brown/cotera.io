import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

/** cspell: disable */
const firebaseApp = initializeApp({
  apiKey: "AIzaSyCAQWp46jkJDTJnfQ7L9HFVf3wKFdgnK6E",
  authDomain: "cotera-io.firebaseapp.com",
  databaseURL: "https://cotera-io.firebaseio.com",
  projectId: "cotera-io",
  storageBucket: "cotera-io.appspot.com",
  messagingSenderId: "382557840417",
  appId: "1:382557840417:web:79847d2b05fb4459de6f60"
});
/** cspell: enable */

export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);

export default firebaseApp;