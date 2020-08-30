import Vue from 'vue';
import App from './App.vue';
import router from './router';

import firebase from '@/firebase';
import state from '@/store';

import '@/assets/fonts/hylia-serif.css';
import '@/assets/fonts/calamity-sans.css';

Vue.config.productionTip = false;

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    state.userid = user.uid;
  } else {
    state.userid = undefined;
  }
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');