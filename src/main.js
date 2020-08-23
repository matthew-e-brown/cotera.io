import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { firestorePlugin } from 'vuefire';

import '@/assets/fonts/hylia-serif.css';
import '@/assets/fonts/calamity-sans.css';

Vue.config.productionTip = false;

Vue.use(firestorePlugin);

new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app');
