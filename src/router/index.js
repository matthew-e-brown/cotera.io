import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    beforeEnter: (t, f, n) => { document.title = "Cotera.io"; n(); },
    component: Home
  },
  {
    path: '/login',
    name: 'Log in',
    beforeEnter: (t, f, n) => { document.title = "Log in | Cotera.io"; n(); },
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    beforeEnter: (t, f, n) => { document.title = "Register | Cotera.io"; n(); },
    component: () => import('../views/Register.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;