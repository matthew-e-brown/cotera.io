import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

import firebase from 'firebase/app';
import 'firebase/auth';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {
      title: "Cotera.io"
    },
    component: Home
  },
  {
    path: '/login',
    name: 'Log in',
    meta: {
      title: "Log in | Cotera.io",
      requiresAuth: 'out'
    },
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    meta: {
      title: "Register | Cotera.io",
      requiresAuth: 'out'
    },
    component: () => import('../views/Register.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || to.title;

  // If the matched route has a requiresAuth field
  if (to.matched.some(record => record.meta.requiresAuth != undefined)) {
    // Register the callback handler, so next() is only called once firebase
    // auth is done its thing
    firebase.auth().onAuthStateChanged(user => {
      // Check if required auth state matches current auth state
      if (to.meta.requiresAuth == 'out' && !user) next();
      else if (to.meta.requiresAuth == 'in' && user) next();
      else next({ path: '/' }); // redirect to home
    });
  } else next();
});

export default router;