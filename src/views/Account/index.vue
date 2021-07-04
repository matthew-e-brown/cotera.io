<template>
  <main id="account" class="sticky-box">
    <h2>Account Settings</h2>
    <p>Currently signed in as <span>{{ user.email }}</span></p>

    <button type="button" class="button" @click="signOut">Sign out</button>

    <section id="email-and-password">
      <h3 class="line">Email &amp; Password</h3>
      <TheEmailAndPasswordSection v-if="hasEmail" />
      <p v-else>
        You don't have an email and password linked to this account yet; take a
        look below to add one for sign-in.
      </p>
    </section>

    <section id="sign-in-methods">
      <h3 class="line">Sign-in Methods</h3>
      <TheSignInMethodsSection
        @needs-re-auth="currentModalView = ModalViews.Reauthenticate"
        @open-link-form="currentModalView = ModalViews.LinkAccount"
      />
    </section>

    <section id="danger-zone">
      <h3 class="line">Danger Zone</h3>
      <TheDangerZoneSection
        @start-reset="currentModalView = ModalViews.ResetWarning"
        @start-delete="currentModalView = ModalViews.DeletionWarning1"
      />
    </section>

    <TheAccountModal :view="currentModalView" />

  </main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import firebase from 'firebase/app';
import 'firebase/auth';

import router from '@/router';
import { useAuthFlow } from '@/auth-hooks';
import { ModalViews } from './types';
import user, { hasEmail } from './user';

// These components are more for separating than they are for actually
// encapsulating data
import TheEmailAndPasswordSection from './TheEmailAndPasswordSection.vue';
import TheSignInMethodsSection from './TheSignInMethodsSection.vue';
import TheDangerZoneSection from './TheDangerZoneSection.vue';
import TheAccountModal from './TheAccountModal.vue';

import '@/assets/styles/forms.scss';


export default defineComponent({
  name: 'Account',
  components: {
    TheEmailAndPasswordSection, TheSignInMethodsSection, TheDangerZoneSection,
    TheAccountModal
  },
  setup() {
    const { authExecutor } = useAuthFlow();

    const currentModalView = ref(ModalViews.Hidden);

    const signOut = async () => {
      const success = await authExecutor(firebase.auth().signOut());
      if (success) await router.push({ name: 'Home' });
    }

    return { user, hasEmail, signOut, currentModalView, ModalViews };
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

  padding-left: 1.7em;
  padding-right: 1.7em;
}

:deep(.split-buttons) {
  display: flex;
  column-gap: 1em;
  justify-content: flex-start;
  align-items: stretch;

  button {
    flex: 1 1 50%;

    margin-left: 0;
    margin-right: 0;
  }

  .icon-button span { font-size: unset; }
}
</style>