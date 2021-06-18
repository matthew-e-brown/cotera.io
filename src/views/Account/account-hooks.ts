import { ref, computed } from 'vue';
import firebase from 'firebase/app';
import 'firebase/auth';

import router from '@/router';
import { useAuthFlow } from '@/hooks/auth-flow';

export function useUser() {
  const { authExecutor } = useAuthFlow();

  // assert non-null (!) because this route is guarded by a navigation guard
  const user = ref(firebase.auth().currentUser!);

  // Because the updates to Firebase's user object happen within the SDK, we
  // need a way to update our reference (and thusly cascade to all our computed
  // values)

  /**
   * Refreshes the App's reference of all the user's properties. Must be called
   * after anything that alters the user (like a change to email address)
   * occurs.
   */
  const refreshUser = () => user.value = firebase.auth().currentUser!;

  const hasGoogle = computed(() => {
    return user.value.providerData.some(p => p?.providerId == 'google.com');
  });

  const hasPassword = computed(() => {
    return user.value.providerData.some(p => p?.providerId == 'password');
  });

  const signOut = async () => {
    const success = await authExecutor(firebase.auth().signOut());
    if (success) await router.push({ name: 'Home' });
  }

  return { user, refreshUser, signOut, hasGoogle, hasPassword };
}
