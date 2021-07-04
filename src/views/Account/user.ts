import { ref, computed } from 'vue';
import firebase from 'firebase/app';
import 'firebase/auth';

import { fallbackHandler } from '@/auth-hooks';

// assert non-null (!) because this route is guarded by a navigation guard
const user = ref(firebase.auth().currentUser!);

/**
 * Refreshes the App's reference of all the user's properties. Must be called
 * after anything that alters the user (like a change to email address)
 * occurs.
 */
const refreshUser = () => user.value = firebase.auth().currentUser!;

const hasGoogle = computed(() => {
  return user.value.providerData.some(p => p?.providerId == 'google.com')
});

const hasEmail = computed(() => {
  return user.value.providerData.some(p => p?.providerId == 'password')
});

/**
 * Wraps the fallback handler with a check for 'requires-recent-login', to avoid
 * treating it like an extraneous error.
 * @param error Error to be handled.
 */
const errorHandler = (error: any): void => {
  // Throw back out of the AuthHandler flow to be processed by the calling
  // action's code (need to be able to react when attempting to unlink, for
  // example)
  if (error.code === 'auth/requires-recent-login') throw error;
  else fallbackHandler(error);
}

export default user;
export { hasGoogle, hasEmail, refreshUser, errorHandler };