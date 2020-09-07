import Vue from 'vue';
import App from './App.vue';
import router from './router';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faCaretRight, faMinus, faPlus, faStar, faEnvelope
} from '@fortawesome/pro-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

Vue.component('fa-icon', FontAwesomeIcon);
library.add(faCaretRight, faMinus, faPlus, faStar, faEnvelope, faGoogle);

import '@/assets/fonts/calamity-sans.css';
import '@/assets/styles/global.css';

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');