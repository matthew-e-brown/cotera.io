import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';

import firebase from 'firebase/app';
import 'firebase/auth';


declare module 'vue-router' {
  interface RouteMeta {
    title: string;
    requiredAuthState?: 'in' | 'out';
  }
}


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
      /* webpackChunkName: "forms" */
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
      /* webpackChunkName: "forms" */
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
  // If the matched route has a 'requiredAuthState' meta field, check with
  // Firebase first
  if (to.meta.requiredAuthState) {
    const user = firebase.app().auth().currentUser;

    if (to.meta.requiredAuthState == 'in' && !user) {
      next({ path: '/' });
      return;
    }

    else if (to.meta.requiredAuthState == 'out' && user) {
      next({ path: '/' });
      return;
    }
  }

  next();
});


export default router;