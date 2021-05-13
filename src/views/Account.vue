<template>
  <main id="account" class="sticky-box">
    <h2>Account Settings</h2>
    <p>Currently signed in as <span>{{ user.email }}</span></p>
    <button type="button" class="button" @click="signOut">Sign out</button>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import router from '@/router';

import firebase from 'firebase/app';
import 'firebase/auth';

export default defineComponent({
  name: 'Account',
  setup() {
    // assert non-null (!) because this route is guarded by a navigation guard
    const user = ref<firebase.User>(firebase.auth().currentUser!);

    const signOut = async () => {
      try {
        await firebase.auth().signOut();
        router.push({ name: 'Home' });
      } catch (error) {
        console.error(error);
        alert(
          "Could not sign out. This is probably a bug. Please see the " +
          "development console for details."
        );
      }
    }

    return { user, signOut };
  }
});
</script>

<style scoped lang="scss">
@include standalone-sticky(calc(45rem + 5vw), 5rem, 2rem);

h2 {
  margin-bottom: 1.5rem;
}

h2+p {
  font-size: 75%;
  text-align: center;
  color: $fg-color-dim;

  margin: 1rem 0;

  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
  word-wrap: none;

  span { font-style: italic; }
}

h2~.button {
  margin: 1rem auto;
  font-size: 75%;
}
</style>