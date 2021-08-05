<template>
  <main id="account" class="sticky-box">
    <h2>Account Settings</h2>
    <p>Currently signed in as <span>{{ user.email }}</span></p>

    <button type="button" class="button" @click="signOut">Sign out</button>

    <ul v-if="errors.length > 0" class="errors">
      <li v-for="(error, i) in errors" :key="i">{{ error }}</li>
    </ul>

    <div id="unlocked" v-if="sessionOpen">

      <button @click="lock">
        <fa-icon icon="lock-open" title="Lock account" fixed-width />
      </button>

      <span>Click the lock to prevent any further changes.</span>

    </div>

    <div id="locked-wrapper">

      <div id="locked" v-if="!sessionOpen">
        <p>
          To prevent unauthorized changes, we ask that you sign in again before
          making any changes to your account.
        </p>

        <button class="icon-button" @click="openSignIn">
          <fa-icon icon="lock" fixed-width />
          <span>Sign in again</span>
        </button>
      </div>

      <section id="email-and-password" v-if="hasEmail">
        <h3 class="line">Email &amp; Password</h3>
        <TheEmailPassword />
      </section>

      <section id="sign-in-methods">
        <h3 class="line">Sign-in Methods</h3>
        <TheSignInMethods />
      </section>

      <section id="danger-zone">
        <h3 class="line">The Danger Zone</h3>
        <TheDangerZone />
      </section>

    </div>

    <template v-if="modalPayload != null">
      <ConfirmModal
        :no-buttons="modalPayload.reason == ModalReasons.Authorize"
        @confirm="modalPayload.callback"
        @cancel="modalPayload = null"
      >

        <TheReauthForm
          v-if="modalPayload.reason == ModalReasons.Authorize"
          @close="modalPayload = null"
        />

      </ConfirmModal>
    </template>

  </main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import firebase from 'firebase/app';
import 'firebase/auth';

import router from '@/router';
import { useAuthFlow } from '@/auth/hooks';
import { sessionOpen, lock } from '@/auth/session';

import user, { hasEmail } from './user';
import { ModalPayload, ModalReasons } from './types';

import ConfirmModal from '@/components/ConfirmModal.vue';

import TheReauthForm from './components/TheReauthForm.vue';
import TheEmailPassword from './components/TheEmailPassword.vue';
import TheSignInMethods from './components/TheSignInMethods.vue';
import TheDangerZone from './components/TheDangerZone.vue';

import '@/assets/styles/forms.scss';


export default defineComponent({
  name: 'Account',
  components: {
    ConfirmModal, TheReauthForm,
    TheEmailPassword, TheSignInMethods, TheDangerZone
  },
  setup() {
    const errors = ref<string[]>([]);
    const modalPayload = ref<ModalPayload | null>(null);
    const { authExecutor, handleRedirection } = useAuthFlow({ errors });

    const openSignIn = () => {
      modalPayload.value = { reason: ModalReasons.Authorize };
    }

    const signOut = async () => {
      const success = await authExecutor(firebase.auth().signOut());
      if (success) {
        lock(); // clear timed session data and set ref
        await router.push({ name: 'Home' });
      }
    }

    return {
      user, hasEmail, signOut, errors,
      modalPayload, ModalReasons,
      sessionOpen, lock, openSignIn,
    };
  }
});
</script>

<style scoped lang="scss">
@include standalone-sticky(calc(45rem + 5vw), 4.5rem, 2rem);

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
}

section, #locked, #unlocked {
  font-size: 95%;
}

:deep(.split-buttons) {
  display: flex;
  column-gap: 1.7rem;
  justify-content: flex-start;
  align-items: stretch;

  button {
    flex: 1 1 50%;

    margin-left: 0;
    margin-right: 0;
  }

  .icon-button span { font-size: unset; }
}

#locked-wrapper {
  position: relative;
}

#locked {
  position: absolute;
  inset: -1em;
  z-index: 4;

  background-color: $bg-color;

  @supports (backdrop-filter: blur(15px)) {
    background-color: opacify($bg-color-transparent, 0.075);
    backdrop-filter: blur(15px);
  }

  padding: 1em 2em;
  border-radius: 0.35em;

  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;

  p {
    text-align: center;
    font-style: italic;
    color: $fg-color-dim;
  }

  button {
    font-size: 75%;
    margin-left: auto;
    margin-right: auto;
  }
}

#unlocked {

  span, button {
    vertical-align: baseline;
  }

  span {
    font-style: italic;
    color: $fg-color-dim;
  }

  button {
    width: 2.25em;
    height: 2.25em;

    display: inline-flex;
    justify-content: center;
    align-items: center;

    border-radius: 0.5em;
    margin: 0 1em;

    color: $fg-color;
    background-color: $bg-color-accent;
  }

}
</style>