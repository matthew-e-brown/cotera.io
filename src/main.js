import Vue from 'vue';
import App from './App.vue';
import router from './router';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import store from '@/store';
import { firestorePlugin } from 'vuefire';

import '@/assets/fonts/hylia-serif.css';
import '@/assets/fonts/calamity-sans.css';

Vue.config.productionTip = false;

firebase.initializeApp({
  "apiKey": "AIzaSyDO-bUWgR9rU0E1kBEyQEPrPcaZSWZ7rQM",
  "authDomain": "armor-tracker.firebaseapp.com",
  "databaseURL": "https://armor-tracker.firebaseio.com",
  "projectId": "armor-tracker",
  "storageBucket": "armor-tracker.appspot.com",
  "messagingSenderId": "101214793739",
  "appId": "1:101214793739:web:18b4577ec75947d8f8970e"
});

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    store.signedin = true;
    store.user.name = user.displayName;
    store.user.uid = user.uid;
  } else {
    store.signedin = false;
    store.user.name = '';
    store.user.uid = null;
  }
});

Vue.use(firestorePlugin);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');