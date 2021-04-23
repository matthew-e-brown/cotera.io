import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: { title: "Cotera.io" },
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    meta: { title: "About & FAQ | Cotera.io" },
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: "Log in | Cotera.io",
      requiredAuthState: false
    },
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || to.title;
  next();
});

export default router;
