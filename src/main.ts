// Vue
import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';

// Firebase
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { storeAuthChange } from '@/state';

// Fonts
import '@fontsource/epilogue/500.css';
import '@fontsource/epilogue/500-italic.css';
import '@fontsource/epilogue/700.css';

// Styles
import '@/assets/fonts/calamity-sans.css';
import '@/assets/styles/global.scss';

// FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faStar, faSortAlt, faEye, faEyeSlash
} from '@fortawesome/pro-solid-svg-icons';

library.add(faStar, faSortAlt, faEye, faEyeSlash);

/** cspell: disable */
firebase.initializeApp({
  apiKey: "AIzaSyCAQWp46jkJDTJnfQ7L9HFVf3wKFdgnK6E",
  authDomain: "cotera-io.firebaseapp.com",
  databaseURL: "https://cotera-io.firebaseio.com",
  projectId: "cotera-io",
  storageBucket: "cotera-io.appspot.com",
  messagingSenderId: "382557840417",
  appId: "1:382557840417:web:79847d2b05fb4459de6f60"
});
/** cspell: enable */

firebase.app().auth().onAuthStateChanged(storeAuthChange);

createApp(App)
  .use(router)
  .component('fa-icon', FontAwesomeIcon)
  .mount('#app');