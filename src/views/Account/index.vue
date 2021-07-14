<template>
  <main id="account" class="sticky-box">
    <h2>Account Settings</h2>
    <p>Currently signed in as <span>{{ user.email }}</span></p>

    <button type="button" class="button" @click="signOut">Sign out</button>

    <section id="email-and-password">
      <h3 class="line">Email &amp; Password</h3>
      <TheEmailAndPasswordSection />
    </section>

    <section id="danger-zone">
      <h3 class="line">Danger Zone</h3>
      <TheDangerZoneSection />
    </section>

    <TheAccountModal
      v-if="modalPayload !== null"
      :view="modalPayload"
    />

  </main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import firebase from 'firebase/app';
import 'firebase/auth';

import router from '@/router';
import { useAuthFlow } from '@/auth-hooks';
import { ModalPayload } from './types';
import user from './user';

import '@/assets/styles/forms.scss';


export default defineComponent({
  name: 'Account',
  setup() {
    const modalPayload = ref<ModalPayload | null>(null);
    const authExecutor = useAuthFlow();

    const signOut = async () => {
      const success = await authExecutor(firebase.auth().signOut());
      if (success) await router.push({ name: 'Home' });
    }

    return { user, signOut, modalPayload };
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

  span { font-style: italic; }
}

h2~.button {
  margin: 1rem auto;
  font-size: 75%;
}

section :deep(h3) {
  margin: 1.25em 0;
}

section {
  margin-top: 2.25rem;
  font-size: 0.9em;
}

#email-and-password p {
  color: $fg-color-dim;
  padding-left: 1.5em;
}
</style>