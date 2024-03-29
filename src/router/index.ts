import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import Home from '@/views/Home.vue';
import About from '@/views/About.vue';

import { auth } from '@/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';


// Declare required meta information for each route
declare module 'vue-router' {
  interface RouteMeta {
    title: string;
    requiredAuthState?: 'in' | 'out';
  }
}


/**
 * Gets the currently signed in Firebase user.
 * @returns {Promise<User | null>} The currently signed in Firebase user, or
 * null if they're not signed in
 *
 * @note Uses onAuthStateChanged() wrapped in a Promise, since
 * auth().currentUser won't be loaded in time when using on a navigation guard
 * if the user is navigating directly to that URL.
 */
const getUser = (): Promise<User | null> => new Promise(
  (resolve, reject) => {
    // Register callback and immediately un-register it once we get our value
    const unsubscribe = onAuthStateChanged(auth, user => {
      unsubscribe(); // clear listener
      resolve(user); // resolve promise with user
    }, reject);      // reject on error
  }
);


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
    component: About
  },

  {
    path: '/auth',
    redirect: { name: 'Home' },
    component: () => import(/* webpackChunkName: "auth" */'@/views/Auth.vue'),
    props: to => ({ formID: to.path.split('/').pop() }),
    children: [

      {
        path: '/login',
        name: 'Login',
        meta: {
          title: "Log in | Cotera.io",
          requiredAuthState: 'out'
        },
        component: () => import(
          /* webpackChunkName: "auth" */
          '@/views/forms/Login.vue'
        )
      },

      {
        path: '/register',
        name: 'Register',
        meta: {
          title: "Register | Cotera.io",
          requiredAuthState: 'out'
        },
        component: () => import(
          /* webpackChunkName: "auth" */
          '@/views/forms/Register.vue'
        )
      },

      {
        path: '/reset-password',
        name: 'ResetPassword',
        meta: {
          title: "Reset password | Cotera.io",
          requiredAuthState: 'out',
        },
        component: () => import(
          /* webpackChunkName: "auth" */
          '@/views/forms/ResetPassword.vue'
        )
      }

    ]
  },
  {
    path: '/account',
    name: 'Account',
    meta: {
      title: "Account | Cotera.io",
      requiredAuthState: 'in'
    },
    component: () => import(
      /* webpackChunkName: "auth" */
      '@/views/Account/index.vue'
    )
  },
  { path: '/:junk(.*)', redirect: { name: 'Home' } }
];


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});


// Set title after the auth-check is done and we arrive
router.afterEach(to => document.title = to.meta.title);

// Check that we are authorized to see this page
router.beforeEach(async (to, _, next) => {

  // If the matched route has a 'requiredAuthState' meta field, check with
  // Firebase first
  if (to.meta.requiredAuthState) {

    const user = await getUser();

    if (to.meta.requiredAuthState == 'in' && user === null) {
      next({ name: 'Home' });
      return;
    }

    else if (to.meta.requiredAuthState == 'out' && user !== null) {
      next({ name: 'Home' });
      return;
    }
  }

  // If no requiredAuthState or if they passed the checks
  next();
});


export default router;