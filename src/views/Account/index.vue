<template>
  <main id="account" class="sticky-box">
    <h2>Account Settings</h2>
    <p>Currently signed in as <span>{{ user.email }}</span></p>
    <button type="button" class="button" @click="signOut">Sign out</button>

    <section id="email-and-password">
      <h3>Email and Password</h3>
      <TheEmailAndPasswordSection />
    </section>

    <section id="sign-in-methods">
      <h3>Sign-in Methods</h3>
      <TheSignInMethodsSection />
    </section>

    <section id="danger-zone">
      <h3>Danger Zone</h3>
      <TheDangerZoneSection />
    </section>

    <TheAccountModal :view="currentModalView" />

  </main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import { ModalViews } from './accounts-types';
import { useUser } from './account-hooks';

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
    const currentModalView = ref(ModalViews.Hidden);

    return { currentModalView, ...useUser() };
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

section::v-deep h3 {
  margin: 1.25em 0;
}

section {
  margin-top: 2.25rem;
  font-size: 0.9em;
}
</style>