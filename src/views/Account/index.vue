<template>
  <main id="account" class="sticky-box">
    <h2>Account Settings</h2>
    <p>Currently signed in as <span>{{ user.email }}</span></p>

    <button type="button" class="button" @click="signOut">Sign out</button>

    <section id="email-and-password">
      <h3 class="line">Email &amp; Password</h3>
      <TheEmailAndPasswordSection v-if="hasEmail" />
      <p v-else>
        You don't have an email and password linked to this account for
        sign-in. See the section below to link one.
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

    <TheAccountModal :view="currentModalView" />

  </main>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import firebase from 'firebase/app';
import 'firebase/auth';

import router from '@/router';
import { useAuthFlow } from '@/auth-hooks';
import { ModalViews } from './types';
import user from './user';

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

    const hasGoogle = computed(() => {
      return user.value.providerData.some(p => p?.providerId == 'google.com')
    });

    const hasEmail = computed(() => {
      return user.value.providerData.some(p => p?.providerId == 'password')
    });

    const signOut = async () => {
      const success = await authExecutor(firebase.auth().signOut());
      if (success) await router.push({ name: 'Home' });
    }

    return {
      user, hasGoogle, hasEmail, signOut,
      currentModalView,
    };
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
</style>