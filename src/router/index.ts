import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';

import firebase from 'firebase/app';
import 'firebase/auth';


const routes: Array<RouteRecordRaw> = [
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
    component: () => import(
      /* webpackChunkName: "about" */
      '../views/About.vue'
    )
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: "Log in | Cotera.io",
      requiredAuthState: 'out'
    },
    component: () => import(
      /* webpackChunkName: "login" */
      '../views/Login.vue'
    )
  },
  {
    path: '/account',
    name: 'Account',
    meta: {
      title: "Account | Cotera.io",
      requiredAuthState: 'in'
    },
    component: () => import(
      /* webpackChunkName: "account" */
      '../views/Account.vue'
    )
  }
];


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});


router.afterEach(to => {
  if (typeof to.meta.title == 'string')
    document.title = to.meta.title;
  else
    document.title = "Cotera.io";
});


router.beforeEach((to, _, next) => {

  // If (any of) the matched route(s) have a 'requiredAuthState' meta field,
  // check with Firebase first
  if (to.matched.some(record => record.meta.requiredAuthState)) {
    const user = firebase.app().auth().currentUser;

    if (to.meta.requiredAuthState == 'in') {
      if (user) next();
      else next({ path: '/' });
    } else if (to.meta.requiredAuthState == 'out') {
      if (!user) next();
      else next({ path: '/' });
    } else {
      console.error("Route meta.requiredAuthState information mismatch.");
      next({ path: '/' });
    }
  }

  else next();

});


export default router;