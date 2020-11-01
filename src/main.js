import Vue from 'vue';
import App from './App.vue';
import router from './router';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faGoogle, faGithub, faCanadianMapleLeaf
} from '@fortawesome/free-brands-svg-icons';
import {
  faCaretRight, faMinus, faPlus, faStar, faEnvelope, faEye, faEyeSlash,
  faSortAlt, faChevronCircleDown, faCode, faHeart
} from '@fortawesome/pro-solid-svg-icons';

Vue.component('fa-icon', FontAwesomeIcon);
library.add(
  faCaretRight, faMinus, faPlus, faStar, faEnvelope, faEye, faEyeSlash,
  faSortAlt, faChevronCircleDown, faCode, faHeart, faGoogle, faGithub,
  faCanadianMapleLeaf
);

import '@/assets/fonts/calamity-sans.css';
import '@/assets/styles/global.css';

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');