// Vue
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import './registerServiceWorker';

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

createApp(App)
  .use(router)
  .component('fa-icon', FontAwesomeIcon)
  .mount('#app');