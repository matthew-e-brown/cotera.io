<template>
  <main id="account" class="sticky-box">
    <h2>Account Settings</h2>
    <p>Currently signed in as <span>{{ user.email }}</span></p>

    <button type="button" class="button" @click="signOut">Sign out</button>

    <ul v-if="errors.length > 0" class="errors">
      <li v-for="(error, i) in errors" :key="i">{{ error }}</li>
    </ul>

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
      <TheSignInMethodsSection />
    </section>

    <section id="danger-zone">
      <h3 class="line">Danger Zone</h3>
      <TheDangerZoneSection />
    </section>

    <TheAccountModal v-if="modalPayload !== null" :view="modalPayload" />

  </main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import firebase from 'firebase/app';
import 'firebase/auth';

import router from '@/router';
import { useAuthFlow } from '@/auth-hooks';
import { ModalReasons, ModalPayload } from './types';
import user, { hasEmail, refreshUser } from './user';

// These components are more for separating concerns and shrinking file
// line-counts than they are for actually encapsulating data
// import TheEmailAndPasswordSection from './TheEmailAndPasswordSection.vue';
// import TheSignInMethodsSection from './TheSignInMethodsSection.vue';
// import TheDangerZoneSection from './TheDangerZoneSection.vue';
// import TheAccountModal from './TheAccountModal/index.vue';

import '@/assets/styles/forms.scss';


// https://stackoverflow.com/a/15724300/10549827
const getCookie = (name: string): string | undefined => {
  const s = `; ${document.cookie}`;
  const p = s.split(`; ${name}=`);
  if (p.length == 2) return p.pop()?.split(';').shift();
}


export default defineComponent({
  name: 'Account',
  // components: {
  //   TheEmailAndPasswordSection, TheSignInMethodsSection, TheDangerZoneSection,
  //   TheAccountModal
  // },
  setup() {
    const errors = ref<string[]>([]);
    const modalPayload = ref<ModalPayload | null>(null);
    const { authExecutor, handleRedirection } = useAuthFlow({ errors });


    const signOut = async () => {
      const success = await authExecutor(firebase.auth().signOut());
      if (success) await router.push({ name: 'Home' });
    }


    handleRedirection().then(async success => {
      if (success === true) {
        const reason = getCookie('redirect-reason');
        if (reason === undefined) return;

        // Check all of the things that could have caused a redirection
        switch (reason as ModalReasons) {
          case ModalReasons.LinkEmail:

            const email = getCookie('email') ?? '';
            const password = getCookie('password') ?? '';

            const cred = firebase.auth
              .EmailAuthProvider.credential(email, password);

            success = await authExecutor(user.value.linkWithCredential(cred));
            break;

          case ModalReasons.UnlinkEmail:
            success = await authExecutor(user.value.unlink('password'));
            break;

          case ModalReasons.UnlinkGoogle:
            success = await authExecutor(user.value.unlink('google.com'));
            break;

          case ModalReasons.DeleteFinalWarning:
            // delete database progress
            success = await authExecutor(user.value.delete());

            if (success) {
              await router.push({ name: 'Home' });
              return;
            }

            break;
        }

        if (success) refreshUser();

      }
    });


    return { user, hasEmail, signOut, errors, modalPayload };
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
</style>