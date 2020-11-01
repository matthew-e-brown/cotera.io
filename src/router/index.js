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
    path: '/about',
    name: 'About',
    meta: {
      title: "About & FAQ | Cotera.io"
    },
    component: () => import('../views/About.vue')
  },
  {
    path: '/register',
    name: 'Register',
    meta: {
      title: "Register | Cotera.io",
      requiresAuth: 'out'
    },
    component: () => import('../views/Register.vue')
  },
  {
    path: '/register/account-link',
    name: 'AccountLink',
    meta: {
      title: "Link Account | Cotera.io",
      requiresAuth: 'in'
    },
    beforeEnter: (to, from, next) => {
      // Don't let them re-link again
      const { providerData } = firebase.auth().currentUser;
      if (providerData.some(p => p.providerId == 'password')) {
        next({ path: '/account' });
      } else next();
    },
    component: () => import('../views/Register.vue')
  },
  {
    path: '/login/reset',
    name: 'PasswordReset',
    meta: {
      title: "Reset Password | Cotera.io",
      requiresAuth: 'out'
    },
    component: () => import('../views/Login.vue')
  },
  {
    path: '/account',
    name: 'Account',
    meta: {
      title: "Account | Cotera.io",
      requiresAuth: 'in'
    },
    component: () => import('../views/Account.vue')
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