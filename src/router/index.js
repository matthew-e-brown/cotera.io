import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    beforeEnter: (t, f, n) => { document.title = "Cotera"; n(); },
    component: Home
  },
  {
    path: '/login',
    name: 'Log In',
    beforeEnter: (t, f, n) => { document.title = "Log in to Cotera"; n(); },
    component: () => import('../views/Login.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;