// Vue
import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';

// Fonts and styles
import '@fontsource/epilogue/500.css';
import '@fontsource/epilogue/500-italic.css';
import '@fontsource/epilogue/700.css';
import '@/assets/fonts/calamity-sans.css';
import '@/assets/styles/global.scss';

createApp(App).use(router).mount('#app');