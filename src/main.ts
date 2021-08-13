// Vue
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import './registerServiceWorker';

// Firebase
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { onAuthStateChanged } from '@/store';

// Fonts
import '@fontsource/epilogue/300.css';
import '@fontsource/epilogue/500.css';
import '@fontsource/epilogue/700.css';
import '@fontsource/epilogue/300-italic.css';
import '@fontsource/epilogue/500-italic.css';

// Styles
import 'normalize.css';
import '@/assets/fonts/calamity-sans.css';
import '@/assets/styles/global.scss';

// FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faGoogle, faGithub, faCanadianMapleLeaf
} from '@fortawesome/free-brands-svg-icons';
import {
  faCaretRight, faCaretDown, faCaretUp, faMinus, faPlus, faPlusCircle, faCheck,
  faTimes, faTrashAlt, faPen, faStar, faEllipsisV, faEnvelope, faEye, faLock,
  faLockOpen, faEyeSlash, faSortAlt, faChevronCircleDown, faCode, faHeart
} from '@fortawesome/pro-solid-svg-icons';

library.add(
  faCaretRight, faCaretDown, faCaretUp, faMinus, faPlus, faPlusCircle, faCheck,
  faTimes, faTrashAlt, faPen, faStar, faEllipsisV, faEnvelope, faEye, faLock,
  faLockOpen, faEyeSlash, faSortAlt, faChevronCircleDown, faCode, faHeart,
  faGoogle, faGithub, faCanadianMapleLeaf
);

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

firebase.app().auth().onAuthStateChanged(onAuthStateChanged);

createApp(App)
  .use(router)
  .component('fa-icon', FontAwesomeIcon)
  .mount('#app');