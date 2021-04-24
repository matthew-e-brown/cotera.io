import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import firebase from '@/firebase';

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
      requiredAuthState: 'out'
    },
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/account',
    name: 'Account',
    meta: {
      title: "Account | Cotera.io",
      requiredAuthState: 'in'
    },
    component: () => import(/* webpackChunkName: "account" */ '../views/Account.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || to.title;

  // If (any of) the matched route(s) have a 'requiredAuthState' meta field,
  // check with Firebase first
  if (to.matched.some(record => record.meta.requiredAuthState)) {
    firebase.auth().onAuthStateChanged(user => {
      switch (to.meta.requiredAuthState) {
        case 'in':
          if (user) next();
          else next({ path: '/' });
          break;
        case 'out':
          if (user) next({ path: '/' });
          else next();
          break;
        default:
          console.error("Route meta.requiredAuthState information mismatch.");
          next();
      }
    });
  }

  else {
    next();
  }
});

export default router;
